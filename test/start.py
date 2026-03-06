import subprocess
import time
import re
import os

def get_perf_data(perf_cmd, output_file, duration=None, run_curl=False):
    # Starta mätning
    perf_proc = subprocess.Popen(perf_cmd, preexec_fn=os.setpgrp)
    
    start_time = time.time()
    
    if run_curl:
        print("[*] Kör 100 curls...")
        for _ in range(100):
            subprocess.run(["curl", "-s", "-o", "/dev/null", "http://localhost:3000/query/postgres"])
    elif duration:
        print(f"[*] Mäter idle i {duration} sekunder...")
        time.sleep(duration)
    
    # Stoppa mätning
    os.killpg(os.getpgid(perf_proc.pid), 2) # SIGINT
    perf_proc.wait()
    end_time = time.time()
    
    # Läs Joules från filen
    with open(output_file, "r") as f:
        content = f.read()
        match = re.search(r'([\d\s,.\xa0]+)\s+Joules\s+power/energy-pkg/', content)
        joules = float(match.group(1).replace(',', '.').replace('\xa0', '').replace(' ', '')) if match else 0
        
    return joules, (end_time - start_time)

# --- STEG 1: MÄT IDLE ---
perf_idle_cmd = ["sudo", "perf", "stat", "-a", "-e", "power/energy-pkg/", "-o", "idle.txt"]
idle_joules, idle_time = get_perf_data(perf_idle_cmd, "idle.txt", duration=5)
joules_per_sec_idle = idle_joules / idle_time
print(f"Baseline (Idle): {joules_per_sec_idle:.2f} Joules/sek (Watt)")

# --- STEG 2: MÄT LOAD ---
perf_load_cmd = ["sudo", "perf", "stat", "-a", "-e", "power/energy-pkg/", "-o", "load.txt"]
load_joules, load_time = get_perf_data(perf_load_cmd, "load.txt", run_curl=True)
print(f"Total energi under load: {load_joules:.2f} Joules på {load_time:.2f} sek")

# --- STEG 3: RÄKNA UT NETTO ---
# Dra bort vad datorn ändå skulle ha dragit under samma tid
netto_energi = load_joules - (joules_per_sec_idle * load_time)
energi_per_query = netto_energi / 100

print("\n" + "="*30)
print(f"NETTO ENERGI FÖR 100 QUERIES: {max(0, netto_energi):.4f} J")
print(f"ENERGI PER QUERY: {max(0, energi_per_query):.6f} J")
print("="*30)
