import papermill as pm
import numpy as np
import pandas as pd
import datetime


input_data='./input_data/'
output_data='./output_data/'
cc_case='WC2'

sims=pd.read_csv(output_data + 'CC/climate_change_sims_' + cc_case + '.csv').set_index('SimNo')

for sim in sims.itertuples():
    if sim.Index>=0:
        #pm.execute_notebook('d_ewr_setup.ipynb','-',parameters = dict(input_file='CC/ngonye_daily_' + str(cc_case) + '_' + str(sim.Index)))
        #pm.execute_notebook('e_power_energy.ipynb','-',parameters = dict(input_file='CC/ngonye_daily_' + str(cc_case) + '_' + str(sim.Index)))
        