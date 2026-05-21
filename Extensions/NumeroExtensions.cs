using System;

namespace TremBomApi.Extensions
{
    public static class NumeroExtensions
    {
        public static string FormatarQuantidade(this int numero)
        {
            if (numero < 1000)
                return numero.ToString();

            if (numero < 1000000)
            {
                // Divide por 1000 e formata com até 1 casa decimal (ex: 1.5K ou 10K)
                double resultado = (double)numero / 1000;
                return resultado.ToString("0.#") + "K";
            }

            // Para milhões
            double milhoes = (double)numero / 1000000;
            return milhoes.ToString("0.#") + "M";
        }
    }
}