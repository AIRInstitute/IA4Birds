import cron from 'node-cron';
import axios from 'axios';
import redis from './redis.config';
import globalConfig from './global.config'; 

// Definición de la interfaz de los datos de DataBird
interface DataBird {
  recordings: any[];
}
// Definición de la interfaz de los datos de WindMap
interface WindMap {
  recordings: any[];
}


// Función para determinar si hoy es el último día del mes
function isLastDayOfMonth(): boolean {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.getDate() === 1;
}

// Programar dataBird para ejecutarse una vez al mes cuando sea el último día del mes, ya sea 28, 29, 30 o 31
cron.schedule('0 0 * * *', async () => {
    if (isLastDayOfMonth()) {
        try {
        const response = await axios.get<DataBird>(`${globalConfig.pythonURL}/dataBird`);
        const dataBirdData = response.data;

        await redis.set('dataBirdKey', JSON.stringify(dataBirdData));
        console.log('Datos de dataBird actualizados en Redis');
        } catch (error) {
            console.error('Error actualizando datos de dataBird desde el servicio Python', error);
        }
    }
});

// Programar windMapData para ejecutarse una vez al mes cuando sea el último día del mes, ya sea 28, 29, 30 o 31
cron.schedule('0 0 * * *', async () => {
    if (isLastDayOfMonth()) {
        try {
        const response = await axios.post<WindMap>(`${globalConfig.pythonURL}/windmap`);
        const windMapData = response.data;

        await redis.set('windMapDataKey', JSON.stringify(windMapData));
        console.log('Datos de windmap actualizados en Redis');
        } catch (error) {
            console.error('Error actualizando datos de windmap desde el servicio Python', error);
        }
    }
});