function calcularTempoPassado(timestamp) {
        const conversaoTime = parseInt(timestamp);
        if (isNaN(conversaoTime)) return "Data inválida";

        const dataPost = new Date(conversaoTime);
        const agora = new Date();
        const diferencaEmSegundos = Math.floor((agora - dataPost) / 1000);

        if (diferencaEmSegundos < 60) {
            return "Agora mesmo";
        }

        const diferencaEmMinutos = Math.floor(diferencaEmSegundos / 60);
        if (diferencaEmMinutos < 60) {
            return `Há ${diferencaEmMinutos} ${diferencaEmMinutos === 1 ? 'minuto' : 'minutos'}`;
        }

        const diferencaEmHoras = Math.floor(diferencaEmMinutos / 60);
        if (diferencaEmHoras < 24) {
            return `Há ${diferencaEmHoras} ${diferencaEmHoras === 1 ? 'hora' : 'horas'}`;
        }

        const diferencaEmDias = Math.floor(diferencaEmHoras / 24);
        if (diferencaEmDias < 7) {
            return `Há ${diferencaEmDias} ${diferencaEmDias === 1 ? 'dia' : 'dias'}`;
        }

        return dataPost.toLocaleDateString('pt-BR');
    }
    
window.calcularTempoPassado = calcularTempoPassado;
