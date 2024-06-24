const getInput = async (title, inputLabel, failmsg, validator) =>
  Swal.fire({
    title,
    input: "text",
    inputLabel,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) return failmsg;
      if (validator) return validator(value);
    },
  });

const obterDadosAluno = async () => {
  let formData = localStorage.getItem("formData");
  if (!formData) return;
  let objData = JSON.parse(formData);

  document.getElementById("nome-aluno").innerHTML =
    objData.nome ?? "Não informado";
  document.getElementById("idade-aluno").innerHTML =
    objData.idade + " ano" + (objData.idade > 1 ? "s" : "") ?? "Não informada";
  document.getElementById("serie-aluno").innerHTML =
    objData.serie ?? "Não informada";
  document.getElementById("escola-aluno").innerHTML =
    objData.escola ?? "Não informada";
  document.getElementById("materia-aluno").innerHTML =
    objData.materia ?? "Não informada";
};

// calcular a media das notas
const calcularMedia = (notas) => {
  let soma = notas.reduce(
    (acumulador, valorAtual) => acumulador + valorAtual,
    0
  );
  if (soma == 0) return;
  return (soma / notas.length).toFixed(1);
};

// adicionar uma nova linha na tabela
const adicionarMateria = async (event) => {
  event.preventDefault(); // Arruma o bug duplo ao executar a funcao

  let materia = (
    await getInput(
      "Qual o nome da materia deseja adicionar?",
      "Matéria",
      "Matéria não informada!"
    )
  )?.value;
  if (!materia) return;

  let storageNotas = JSON.parse(localStorage.getItem("notas"));
  let notas = [];
  let i = 0;

  while (i < 4) {
    let nota = (
      await getInput(
        `Digite a nota ${i + 1} da matéria ${materia}:`,
        "Nota",
        "Nota não informada!",
        (value) => {
          if (isNaN(value) || value < 0 || value > 10)
            return "Nota inválida! Insira um valor valido entre 0 e 10.";
        }
      )
    )?.value;
    if (!nota) continue;
    nota = parseFloat(nota.replace(",", "."));
    notas.push(nota);
    i++;
  }

  storageNotas.push({ nome: materia, notas });
  localStorage.setItem("notas", JSON.stringify(storageNotas));

  updateGrade();
  // Atualiza a média geral
  atualizarMedias();
};

const atualizarMedias = () => {
  let storageData = JSON.parse(localStorage.getItem("notas"));
  let todasNotas = [];

  storageData.forEach((item) =>
    todasNotas.push(parseFloat(calcularMedia(item.notas)))
  );
  let mediaGeral = calcularMedia(todasNotas)?.toString().replace(".", ",");
  document.getElementById("media-geral").textContent = mediaGeral;

  let maiorMedia = Math.max(...todasNotas)
    ?.toFixed(1)
    .toString()
    .replace(".", ",");
  document.getElementById("maior-media").textContent = maiorMedia;
};

const setGrade = (item) => {
  let media = calcularMedia(item.notas);

  let tbody = document.getElementById("tbody-notas");
  let htmlnotas = `<tr><th>${item.nome}</th>`;
  item.notas.forEach(
    (nota) =>
      (htmlnotas += `<td>${nota.toFixed(1).toString().replace(".", ",")}</td>`)
  );
  htmlnotas += `<td>${media.toString().replace(".", ",")}</td></tr>`;

  tbody.innerHTML += htmlnotas;
};
const updateGrade = () => {
  document.getElementById("tbody-notas").innerHTML = "";
  let storageNotas = JSON.parse(localStorage.getItem("notas"));
  storageNotas.forEach((item) => setGrade(item));
};

const initGrades = () => {
  let gradeArray = [{ nome: "Matemática", notas: [7.5, 8, 6, 9] }];
  localStorage.setItem("notas", JSON.stringify(gradeArray));
  gradeArray.forEach((item) => setGrade(item));
};

const getAlunos = () => {
  const url = "http://localhost:3000/alunos";
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Ocorreu um erro ao consultar os Alunos");
    })
    .then((data) => {
      let alunosField = document.getElementById("lista-alunos");
      alunosField.innerHTML = "";
      data.forEach(
        (aluno) => (alunosField.innerHTML += "<li>" + aluno.nome + "</li>")
      );
    })
    .catch((error) => {
      Swal.fire(error, "", "error");
    });
};

document.querySelector("#addLinha").addEventListener("click", adicionarMateria);

window.onload = () => {
  initGrades();
  obterDadosAluno();
  getAlunos();
};
