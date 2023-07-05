//1.Create
function handleSubmit(event) {
    event.preventDefault();
    //form의 submit 이벤트는 됨가 동시에 redirect이벤트 일어남
    //redirect 방지-> 없을시 깜빡
    const input = document.querySelector('#memo-input');
    createMemo(input.value);
    input.value='';
    //한번 submit하고 input을 비워 주기 위해
}
async function createMemo(value){
    const res= await fetch('/memos',{//res은 서버가 요청을 받은후 응답값이 들어감
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',//필수
        },
        body: JSON.stringify({//body안에 있는 값은 json의형태인데 통신을 할때는 문자열의 형태로만 전송을 할수가 있어서
            id: new Date().getTime(),
            content: value,
        }),

    });
    const jsonRes = await res.json();
    readMemo();
}

const form= document.querySelector('#memo-form');
form.addEventListener('submit',handleSubmit);//submit될때마다 서버에 메모 post함과 동시에 read

//2.Read
async function readMemo() {
    const res = await fetch('/memos');//res에는 get요청에 응답하여 리스트 반환
    const jsonRes =await res.json();
    //ul을 다시 싹 비우고 서버에 저장된 값을 read해서 띄우기
    //비우는 과정이 없을 경우에는 전에 한 작업이 그대로 보임
    const ul= document.querySelector('#memo-ul');
    ul.innerHTML= '';
    jsonRes.forEach(displayMemo);
}
function displayMemo(memo){//ul(프론트)에 업데이트
    const ul = document.querySelector('#memo-ul');
    const li = document.createElement('li');
    li.innerText= `[id:${memo.id}] ${memo.content} `;

    editBtn=document.createElement('button');
    editBtn.innerText ="수정하기";
    editBtn.addEventListener('click',editMemo);
    editBtn.dataset.id=  memo.id;//버튼태그안에 해당메모의 id값을 저장하기 위해서(data-id='')

    deleteBtn=document.createElement('button');
    deleteBtn.innerText ="삭제하기";
    deleteBtn.addEventListener('click',deleteMemo);
    deleteBtn.dataset.id=  memo.id;//버튼태그안에 해당메모의 id값을 저장하기 위해서(data-id='')

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    ul.appendChild(li);
}

//3.update
async function editMemo(event){
    const id =event.target.dataset.id;
    const editInput=prompt("수정할 값을 입력하세요");
    //  path parameter 방식으로 서버에게 정보 전달
    const res = await fetch(`/memos/${id}`,{//res은 서버가 요청을 받은후 응답값이 들어감
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json',//필수
        },
        body: JSON.stringify({//body안에 있는 값은 json의형태인데 통신을 할때는 문자열의 형태로만 전송을 할수가 있어서
            id:id,
            content: editInput,
        }),
    });
    readMemo();
}

//4.delete
async function deleteMemo (event){
    const id =event.target.dataset.id;
    //  path parameter 방식으로 서버에게 정보 전달
    const res = await fetch(`/memos/${id}`,{//res은 서버가 요청을 받은후 응답값이 들어감
        method: 'DELETE',
    });
    readMemo();
}

readMemo();//새로고침해도 그대로 유지