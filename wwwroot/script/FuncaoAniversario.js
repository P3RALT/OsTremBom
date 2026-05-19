 document.addEventListener("DOMContentLoaded", () => {
            const day = document.getElementById("day");
            const month = document.getElementById("month");
            const year = document.getElementById("year");

            if (!day || !month || !year) {
                console.error("IDs não encontrados");
                return;
            }

          
            const currentYear = new Date().getFullYear();

            for (let i = currentYear; i >= 1900; i--) {
                const opt = document.createElement("option");
                opt.value = i;
                opt.textContent = i;
                year.appendChild(opt);
            }

            function updateDays() {
                const m = parseInt(month.value);
                const y = parseInt(year.value);

                // se der erro ao converter para número, não tenta atualizar os dias
                if (!m || !y) return;

                const daysInMonth = new Date(y, m, 0).getDate();

                day.innerHTML = "";

                for (let i = 1; i <= daysInMonth; i++) {
                const opt = document.createElement("option");
                opt.value = i;
                opt.textContent = i;
                day.appendChild(opt);
                }
            }

            month.addEventListener("change", updateDays);
            year.addEventListener("change", updateDays);

            // O processo só começa quando o ano existe
            updateDays();

            });