using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TremBomApi.Migrations
{
    /// <inheritdoc />
    public partial class AjustesTabela144 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "locais",
                keyColumn: "id",
                keyValue: 10);

            migrationBuilder.DropColumn(
                name: "avaliacao_nota",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "imagem_url",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "imagem_url_2",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "imagem_url_3",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "total_comentarios",
                table: "locais");

            migrationBuilder.DropColumn(
                name: "total_likes",
                table: "locais");

            migrationBuilder.RenameColumn(
                name: "horario_texto",
                table: "locais",
                newName: "resumo");

            migrationBuilder.AddColumn<DateTime>(
                name: "atualizado_em",
                table: "locais",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "atualizado_em",
                table: "locais");

            migrationBuilder.RenameColumn(
                name: "resumo",
                table: "locais",
                newName: "horario_texto");

            migrationBuilder.AddColumn<double>(
                name: "avaliacao_nota",
                table: "locais",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "imagem_url",
                table: "locais",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imagem_url_2",
                table: "locais",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imagem_url_3",
                table: "locais",
                type: "TEXT",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "total_comentarios",
                table: "locais",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "total_likes",
                table: "locais",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "locais",
                columns: new[] { "id", "ativo", "avaliacao_nota", "bairro", "CEP", "categoria", "Cidade", "data_cadastro", "descricao", "dicas", "horario_texto", "imagem_url", "imagem_url_2", "imagem_url_3", "latitude", "longitude", "nome", "numero", "oq_fazer", "pq_visitar", "rua", "total_comentarios", "total_likes" },
                values: new object[,]
                {
                    { 1, true, 4.7999999999999998, "Pampulha", 31365450, "Cultura e Arquitetura", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Famosa igreja projetada por Oscar Niemeyer, com painéis de Cândido Portinari, localizada na beira da Lagoa da Pampulha.", "Vá no fim da tarde para pegar o pôr do sol na lagoa.", null, "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg/250px-Igrejinha_de_S%C3%A3o_Francisco_de_Assis_6.jpeg", null, null, -19.858499999999999, -43.979100000000003, "Igreja São Francisco de Assis (Igrejinha da Pampulha)", 3000, "Tirar fotos da fachada, visitar o interior do museu e caminhar pela orla.", "É o principal cartão-postal de BH e Patrimônio Cultural da Humanidade pela UNESCO.", "Avenida Otacílio Negrão de Lima", 45, 150 },
                    { 2, true, 4.9000000000000004, "Centro", 30190056, "Gastronomia e Compras", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "O coração da cultura mineira, com centenas de lojas vendendo queijos, doces, artesanatos e temperos.", "Costuma ficar muito cheio aos sábados de manhã. Vá de táxi ou aplicativo pois o estacionamento é disputado.", null, "https://exemplo.com/mercado1.jpg", null, null, -19.922899999999998, -43.944400000000002, "Mercado Central de Belo Horizonte", 744, "Provar o famoso fígado com jiló, comprar queijo canastra e doces caseiros.", "Eleito um dos melhores mercados do mundo, é o melhor lugar para sentir a verdadeira vibe mineira.", "Avenida Augusto de Lima", 98, 320 },
                    { 3, true, 4.7000000000000002, "Funcionários", 30140010, "Lazer e Cultura", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Praça histórica cercada por belíssimos prédios públicos antigos que hoje formam o Circuito Cultural Praça da Liberdade.", "A visitação à maioria dos museus do circuito é gratuita.", null, "https://www.quintoandar.com.br/guias/wp-content/uploads/2023/04/Praca-da-Liberdade-em-Belo-Horizonte-Foto-Shutterstock.jpg", null, null, -19.932300000000001, -43.938099999999999, "Praça da Liberdade", 1, "Caminhar sob a alameda de palmeiras imperiais e visitar os museus ao redor.", "Une uma linda área verde com acesso direto aos melhores museus e centros culturais da cidade.", "Praça da Liberdade", 35, 210 },
                    { 4, true, 4.5999999999999996, "Mangabeiras", 30210310, "Natureza e Vista", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Localizado em uma área de preservação, oferece uma vista panorâmica espetacular de toda a cidade de BH.", "Leve um agasalho, pois costuma ventilar bastante e fazer frio lá em cima.", null, "https://offloadmedia.feverup.com/belohorizontesecreto.com/wp-content/uploads/2023/08/21122832/mirantes-em-belo-horizonte-1024x683.jpg", null, null, -19.9482, -43.916800000000002, "Mirante do Mangabeiras", 100, "Apreciar a vista das plataformas de madeira e tirar fotos panorâmicas.", "É o ponto mais alto e bonito para ver a imensidão de Belo Horizonte lá do alto.", "Rua Pedro José Pardo", 29, 185 },
                    { 5, true, 4.7000000000000002, "São José", 31275000, "Esportes e Eventos", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "O gigante da Pampulha, palco histórico do futebol mineiro e grandes shows internacionais.", "A esplanada do Mineirão é enorme e excelente para passar a tarde com crianças e pets.", null, "https://historiadofutebol.com/blog/wp-content/uploads/2013/11/092-001-500x330.jpg", null, null, -19.8659, -43.970999999999997, "Minerão (Estádio Governador Magalhães Pinto)", 1001, "Visitar o Museu do Futebol Mineiro e andar de skate ou patins na esplanada.", "Item indispensável para quem ama futebol e quer conhecer o templo do esporte em Minas.", "Avenida Antônio Abrahão Caram", 60, 250 },
                    { 6, true, 4.5, "Centro", 30130003, "Natureza e Parque", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "O mais antigo parque ambiental de BH, localizado bem no centro da cidade, um verdadeiro refúgio verde.", "O parque abriga o tradicional Teatro Francisco Nunes, vale checar a programação.", null, "https://portalbelohorizonte.com.br/sites/default/files/arquivos/ao-ar-livre-e-esportes/2021-11/foto-pbh.jpg", null, null, -19.924199999999999, -43.930599999999998, "Parque Municipal Américo Renné Giannetti", 1377, "Andar de barco a remo nas lagoas, fazer piquenique e ver os pequenos monumentos.", "Ideal para desacelerar e curtir a natureza sem sair da região central da capital.", "Avenida Afonso Pena", 22, 140 },
                    { 7, true, 4.7999999999999998, "Mangabeiras", 30210130, "Lazer e Vista", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Localizada nas altas do bairro Mangabeiras, ganhou esse nome após a visita do Papa João Paulo II em 1980.", "Perfeito para levar uma canga, lanche e fazer um piquenique no final de semana.", null, "https://portalbelohorizonte.com.br/sites/default/files/arquivos/ao-ar-livre-e-esportes/2021-11/praca-do-papa_qu4rto-studio-0056-1_0.jpg", null, null, -19.9453, -43.914200000000001, "Praça do Papa", 1, "Sentar no gramado, contemplar o horizonte e descansar.", "Famosa pela frase do Papa: 'Que belo horizonte!'. A energia e a paz do lugar são incríveis.", "Praça Israel Pinheiro", 40, 280 },
                    { 8, true, 4.9000000000000004, "Inhotim", 35460000, "Arte e Botânica", "Brumadinho", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Embora fique em Brumadinho (região metropolitana), é a principal extensão turística cultural de quem visita BH. Maior museu a céu aberto do mundo.", "Use sapatos muito confortáveis, o museu é gigante e você vai andar bastante.", null, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVYgiX-foSy-CNzygiQBc9Z95TOzdbfFNAWA&s", null, null, -20.124099999999999, -44.220100000000002, "Inhotim (Instituto Contemporâneo)", 20, "Caminhar pelos jardins botânicos espetaculares e entrar nas galerias de arte contemporânea.", "Referência internacional, une perfeitamente arte contemporânea de ponta com paisagismo exuberante.", "Rua B", 150, 500 },
                    { 9, true, 4.5999999999999996, "Centro", 30160041, "Cultura e Teatro", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Grande centro cultural no centro de BH que recebe shows, peças de teatro, cinema e exposições de arte.", "Fique de olho no site oficial deles, pois muitos eventos têm ingressos a preços populares.", null, "https://www.minasgerais.com.br/imagens/atracoes/1542284694Euy5sOet5H.jpg", null, null, -19.923400000000001, -43.9392, "Sesc Palladium", 1046, "Assistir a espetáculos musicais, peças de teatro ou mostras de cinema alternativo.", "Um dos espaços culturais mais modernos e ativos localizados no hipercentro de BH.", "Rua Rio de Janeiro", 14, 95 },
                    { 10, true, 4.2999999999999998, "Mangabeiras", 30210300, "Curiosidade Local", "Belo Horizonte", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Famosa rua ladeira acima onde os carros, quando deixados em ponto morto, parecem subir a rua sozinhos devido a uma ilusão de ótica.", "Faça o teste com cuidado e pisca-alerta ligado para avisar outros motoristas.", null, "https://media-cdn.tripadvisor.com/media/photo-s/07/5c/ec/4e/rua-do-amendoim.jpg", null, null, -19.943100000000001, -43.914900000000003, "Rua do Amendoim", 10, "Colocar o carro em ponto morto (desligado) e testar a famosa ilusão de ótica.", "É um clássico folclórico de mistério e diversão que diverte turistas e moradores há décadas.", "Rua Professor Otávio Coelho Magalhães", 55, 110 }
                });
        }
    }
}
