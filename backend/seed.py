import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import importlib.util
spec = importlib.util.spec_from_file_location("seed_data_mod", os.path.join(BASE_DIR, "seed", "seed_data.py"))
seed_data_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(seed_data_mod)

if __name__ == "__main__":
    seed_data_mod.run_seed()
