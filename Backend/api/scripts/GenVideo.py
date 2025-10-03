# Import delle librerie necessarie
from flask import Flask, request, jsonify, send_file
from PIL import Image
import numpy as np
from moviepy import ImageSequenceClip # Uso l'import che funziona nel tuo ambiente
import os
import time
import traceback

# --- 1. Configurazione ---
print("[LOG] Avvio script e configurazione iniziale...")
app = Flask(__name__)
PORT = 5656
MODEL_PATH = "/Volumes/Data/Synapsis/Models/Wan2.2-TI2V-5B-Q4_K_S.gguf"
OUTPUT_DIR = "generated_videos"
FPS = 24

print(f"[LOG] Porta server: {PORT}")
print(f"[LOG] Path modello: {MODEL_PATH}")

# Crea la cartella per i video se non esiste
os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"[LOG] Cartella '{OUTPUT_DIR}' verificata/creata.")

# --- 2. Caricamento del Modello ---
llm = None
print("\n[LOG] --- Inizio Caricamento Modello ---")
try:
    from ctransformers import AutoModelForCausalLM
    print("[LOG] Libreria 'ctransformers' importata con successo.")
    
    # ==================================================================
    # === AZIONE CRITICA: TROVA E INSERISCI IL 'model_type' CORRETTO ===
    # ==================================================================
    # Questo è il parametro più importante. Se è sbagliato, il modello non si caricherà.
    # Cerca la pagina del modello su Hugging Face per trovare la sua architettura di base.
    # Valori comuni sono: 'llama', 'mistral', 'gemma', 'starcoder'.
    MODEL_TYPE_GUESS = 'gguf' # <--- PROVA A CAMBIARE QUESTO SE IL CARICAMENTO FALLISCE
    print(f"[LOG] Tentativo di caricamento con model_type='{MODEL_TYPE_GUESS}'...")
    
    llm = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        model_type=MODEL_TYPE_GUESS,
        gpu_layers=50  # Rimuovi questa riga se non hai una GPU NVIDIA
    )
    print("[LOG] ✅ Modello caricato con successo.")
except Exception as e:
    print(f"[LOG] ❌ ERRORE nel caricamento del modello: {e}")
    print("[LOG] ⚠️  Il server funzionerà in modalità di pura SIMULAZIONE.")
    llm = None
print("[LOG] --- Fine Caricamento Modello ---\n")


# --- 3. Funzione di Generazione Video ---
def create_video(prompt, duration_seconds):
    print("\n[LOG] --- Inizio Funzione 'create_video' ---")
    print(f"[LOG] Ricevuto prompt: '{prompt}', durata: {duration_seconds}s")
    
    model_output = None
    if llm:
        print("[LOG] Modalità: Generazione con modello LLM.")
        try:
            # ==================================================================
            # === ESPERIMENTO: ESEGUIAMO IL MODELLO E STAMPIAMO L'OUTPUT ===
            # ==================================================================
            print("[LOG] Esecuzione del modello in corso... (potrebbe richiedere tempo)")
            # Creiamo un prompt specifico per guidare il modello
            generation_prompt = f"prompt: {prompt}, duration: {duration_seconds} seconds. Frame 1:"
            
            # Chiamiamo il modello
            model_output = llm(generation_prompt, max_new_tokens=2048, temperature=0.7)
            
            print("\n" + "="*60)
            print("[LOG] ✅ MODELLO ESEGUITO CON SUCCESSO!")
            print(f"[LOG] OUTPUT GREZZO DEL MODELLO:\n\n{model_output}\n")
            print("="*60 + "\n")

        except Exception as e:
            print(f"[LOG] ❌ ERRORE durante l'esecuzione del modello: {e}")
            traceback.print_exc()
    else:
        print("[LOG] Modalità: Generazione SIMULATA (il modello non è stato caricato).")

    # --- Per ora, continuiamo a generare un video placeholder per non bloccare la richiesta ---
    
    num_frames = int(duration_seconds * FPS)
    print(f"[LOG] Calcolo frame necessari per video placeholder: {num_frames} frame.")
    
    print(f"[LOG] Inizio generazione di {num_frames} frame simulati...")
    frames = []
    for i in range(num_frames):
        r, g, b = (i * 5) % 255, (i * 2) % 255, 150
        img = Image.new('RGB', (512, 512), color=(r, g, b))
        frames.append(img)
    print(f"[LOG] ✅ {len(frames)} frame simulati generati.")

    print("[LOG] Conversione delle immagini in formato numerico (NumPy array)...")
    numpy_frames = [np.array(img) for img in frames]
    print("[LOG] ✅ Conversione completata.")
    
    print("[LOG] Assemblaggio frame in un clip video con moviepy...")
    clip = ImageSequenceClip(numpy_frames, fps=FPS)
    
    timestamp = int(time.time())
    output_filename = f"video_{timestamp}.mp4"
    output_path = os.path.join(OUTPUT_DIR, output_filename)
    
    print(f"[LOG] Inizio scrittura file video su disco: {output_path}")
    clip.write_videofile(output_path, codec='libx264', logger=None)
    print(f"[LOG] ✅ File video scritto con successo.")
    
    print("[LOG] --- Fine Funzione 'create_video' ---")
    return output_path


# --- 4. Endpoint API ---
@app.route('/generate-video', methods=['POST'])
def handle_generate_video():
    print("\n[LOG] --- Richiesta ricevuta sull'endpoint /generate-video ---")
    try:
        data = request.get_json()
        if not data:
            print("[LOG] ❌ Errore: corpo della richiesta non è JSON o è vuoto.")
            return jsonify({"error": "Richiesta JSON non valida."}), 400
        
        print(f"[LOG] Dati JSON ricevuti: {data}")

        prompt = data.get('prompt')
        duration = data.get('duration', 1)

        if not prompt:
            print("[LOG] ❌ Errore: il parametro 'prompt' è mancante.")
            return jsonify({"error": "Il parametro 'prompt' è obbligatorio."}), 400

        print("[LOG] Parametri validi. Chiamata a 'create_video'...")
        video_path = create_video(prompt, duration)
        
        print(f"[LOG] Generazione completata. Invio del file: {video_path}")
        return send_file(video_path, as_attachment=True, mimetype='video/mp4')

    except Exception as e:
        print(f"[LOG] ❌ ERRORE 500 non gestito durante l'elaborazione della richiesta.")
        print(f"[LOG] Dettagli errore: {e}")
        traceback.print_exc()
        return jsonify({"error": "Errore interno del server. Controlla i log per i dettagli."}), 500


# --- 5. Avvio del Server ---
if __name__ == '__main__':
    print(f"\n[LOG] Avvio del server Flask su http://localhost:{PORT}")
    app.run(host='0.0.0.0', port=PORT)