import axios from 'axios';
import globalMessages from '../utils/messages/global.messages';
import globalConfig from '../config/global.config';


// const uploadCV = async (req, res) => {
//     try{
//         // Hacer la solicitud al servidor Python
//         const response = await axios.get(`${globalConfig.pythonURL}/data`);

//         // Extraer los datos del JSON recibido
//         const { Latitud, Longitud, ambito, area_excl, criterio, espacio, fid, identific, t_instalac } = response.data;
    
//         // Enviar los datos al frontend
//         return res.status(200).json({
//             Latitud,
//             Longitud,
//             ambito,
//             area_excl,
//             criterio,
//             espacio,
//             fid,
//             identific,
//             t_instalac
//         });
//     } catch(err){
//         console.error(err);
//         return res.status(500).send({
//             message: globalMessages[500].INTERNAL_SERVER_ERROR,
//         });
//     }
// }
// const uploadCv = async (req, res) => {
//     try {
//         // Aquí podrías procesar la solicitud, si es necesario
//         const data = {
//             // Datos de python que se van a recibir

//         }
//         // Llamada a Python usando axios
//         const response = await axios.post(`${globalConfig.backendURL}/cvs/analyze`, data);
        
//         // Envío de la respuesta al frontend
//         return res.status(200).send({
//             message: globalMessages[200].CV_UPLOADED_SUCCESSFULLY,
//             data: response.data // Aquí puedes incluir la respuesta de Python si necesitas enviarla al frontend
//         });
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send({
//             message: globalMessages[500].INTERNAL_SERVER_ERROR,
//         });
//     }
// };

// export { getDataJson, uploadCv };
// export { uploadCV };