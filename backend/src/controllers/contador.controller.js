const contadorCtrl = {};
const Contador = require('../models/Contador');

// Función para verificar si el año ha cambiado y reiniciar los contadores si es necesario
const checkAndResetCounters = async (contador) => {
  const currentYear = new Date().getFullYear();

  // Si el contador es de un año anterior, se reinicia
  if (contador.lastResetYear !== currentYear) {
    contador.contadorASP = 0;
    contador.contadorDSP = 0;
    contador.contadorPSP = 0;
    contador.contadorFITO = 0;
    contador.contadorCLR = 0;
    contador.lastResetYear = currentYear;
    await contador.save(); // Guarda los cambios en la base de datos
  }

  return contador;
};

// Obtiene el valor del contador de un determinado tipo de análisis
contadorCtrl.getContador = async (req, res) => {
  try {
    const { tipo } = req.params; // Extrae el tipo de contador desde los parámetros de la URL
    let contador = await Contador.findOne(); // Busca el contador en la base de datos

    if (!contador) {
      return res.status(404).json({ message: 'Contador no encontrado' });
    }

    // Verifica si se necesita reiniciar el contador por cambio de año
    contador = await checkAndResetCounters(contador);

    // Obtiene el valor del contador del tipo solicitado
    const count = contador[`contador${tipo}`];

    // Verifica que el tipo de contador sea válido
    if (count === undefined) {
      return res.status(400).json({ message: 'Tipo de contador no válido' });
    }

    res.json({ count }); // Devuelve el valor del contador
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el contador', error });
  }
};

// Incrementa el valor del contador de un determinado tipo de análisis
contadorCtrl.incrementarContador = async (req, res) => {
  try {
    const { tipo } = req.params; // Extrae el tipo de contador desde la URL
    let contador = await Contador.findOne(); // Busca el contador en la base de datos

    // Si no existe un contador, se crea uno nuevo
    if (!contador) {
      contador = new Contador();
    }

    // Verifica si se necesita reiniciar el contador por cambio de año
    contador = await checkAndResetCounters(contador);

    // Incrementa el contador del tipo especificado
    contador = await Contador.findOneAndUpdate(
      {},
      { $inc: { [`contador${tipo}`]: 1 } },
      { new: true, upsert: true } // Si no existe, lo crea
    );

    if (!contador) {
      return res.status(404).json({ message: 'Contador no encontrado' });
    }

    // Obtiene el nuevo valor del contador
    const newCount = contador[`contador${tipo}`];

    // Verifica que el tipo de contador sea válido
    if (newCount === undefined) {
      return res.status(400).json({ message: 'Tipo de contador no válido' });
    }

    res.json({ newCount }); // Devuelve el nuevo valor del contador
  } catch (error) {
    res.status(500).json({ message: 'Error al incrementar el contador', error });
  }
};

// Obtiene todos los contadores almacenados en la base de datos
contadorCtrl.getAllContadores = async (req, res) => {
  try {
    let contador = await Contador.findOne(); // Busca el contador en la base de datos

    // Si no hay un contador registrado, se crea con valores en cero
    if (!contador) {
      contador = new Contador({
        contadorASP: 0,
        contadorDSP: 0,
        contadorPSP: 0,
        contadorFITO: 0,
        contadorCLR: 0,
      });
      await contador.save();
    }

    // Verifica si se necesita reiniciar el contador por cambio de año
    contador = await checkAndResetCounters(contador);

    res.json(contador); // Devuelve todos los contadores
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los contadores', error });
  }
};

module.exports = contadorCtrl;
;
