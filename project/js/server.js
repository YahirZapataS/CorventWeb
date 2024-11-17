const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    methods: ['GET', 'POST'],
    credentials: true
}));

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'corvent.soporte@gmail.com',
        pass: 'phhq gwnp guao jfsr',
    },
});

app.post('/send-confirmation-email', async (req, res) => {
    const { name, email, date, time, doctorName, service } = req.body;

    try {
        const mailOptions = {
            from: '"Corvent Clínica Odontológica" <corvent.soporte@gmail.com>',
            to: email,
            subject: 'Confirmación de cita',
            html: `
                <h2>Hola, ${name}</h2>
                <p>Tu cita ha sido programada exitosamente.</p>
                <ul>
                    <li><strong>Doctor:</strong> ${doctorName}</li>
                    <li><strong>Servicio:</strong> ${service}</li>
                    <li><strong>Fecha:</strong> ${date}</li>
                    <li><strong>Hora:</strong> ${time}</li>
                </ul>
                <p>Gracias por elegirnos,</p>
                <p>Corvent Clínica Odontológica</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});