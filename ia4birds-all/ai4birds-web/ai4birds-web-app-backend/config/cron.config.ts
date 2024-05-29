import cron from 'node-cron';
import axios from 'axios';
import redis from './redis.config';
import globalConfig from './global.config'; // Asumiendo que esta es la configuración global donde tienes la URL

interface DataBird {
  // Define the shape of the data you expect to receive from the Python service
  // Por ejemplo:
  recordings: any[];
}

// Programar tarea para ejecutarse una vez al mes
cron.schedule('0 0 30 * *', async () => {
  try {
    const response = await axios.get<DataBird>(`${globalConfig.pythonURL}/dataBird`);
    const dataBirdData = response.data;

    await redis.set('dataBirdKey', JSON.stringify(dataBirdData));
    console.log('Datos de dataBird actualizados en Redis');
  } catch (error) {
    console.error('Error actualizando datos de dataBird desde el servicio Python', error);
  }
});