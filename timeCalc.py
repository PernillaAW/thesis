import pandas as pd

# Load CSV
file_path = 'dataTwentyFive.csv'  # adjust if needed
df = pd.read_csv(file_path)

# Extract time (HH:MM:SS)
df['time_part'] = df['Time'].str.split(' ').str[1]
df['hour'] = df['time_part'].str.split(':').str[0].astype(int)
df['minute'] = df['time_part'].str.split(':').str[1].astype(int)

# Minute index (0–1439)
df['minute_index'] = df['hour'] * 60 + df['minute']

# Histogram
histogram = df['minute_index'].value_counts().sort_index()
histogram = histogram.reindex(range(1440), fill_value=0).values

total = len(df)
target = total * 0.05

# Sliding window
left = 0
current_sum = 0
best = None

for right in range(1440):
    current_sum += histogram[right]

    while current_sum >= target:
        if best is None or (right - left) < (best['right'] - best['left']):
            best = {'left': left, 'right': right, 'sum': current_sum}
        current_sum -= histogram[left]
        left += 1

# Convert to time
def to_time(idx):
    h = idx // 60
    m = idx % 60
    return f"{h:02d}:{m:02d}:00"

result = {
    'total_rows': total,
    'target_rows': target,
    'actual_rows': best['sum'],
    'start_time': to_time(best['left']),
    'end_time': to_time(best['right'])
}

print(result)
