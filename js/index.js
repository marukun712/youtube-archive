card = document.getElementById('cardarea')
form = document.getElementById('large-input');
form.addEventListener('keypress', text);

if (localStorage.length == 0) {
  document.getElementById('hello').innerHTML = `こんにちは　アーカイブが全てなくなりました。`
} else {
  document.getElementById('hello').innerHTML = `こんにちは　${localStorage.length}個のアーカイブがあります`
}

var object = []

for (key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    object.push(JSON.parse(localStorage.getItem(key)))
  }
}

for (let i = 0; i < Object.keys(object).length; i++) {
  let title = object[i].title
  let vtuber = object[i].vtuber
  let channel = object[i].channel
  let status = object[i].status
  let date = object[i].day
  let image = object[i].image
  let id = object[i].id

  card.insertAdjacentHTML("beforeend",
    `<div class="flex justify-center p-10">
          <div class="rounded-lg shadow-lg bg-white max-w-sm">
              <img class="rounded-t-lg" src="${image}" alt="" />
            <div class="p-6">
              <h5 class="text-gray-900 ">${title}</h5>
              <p class="text-gray-700 text-base mb-4">
                <a href='${channel}'>${vtuber}</a>
              </p>
              <p class="text-gray-700 text-base mb-4">
              登録日
              ${date}
              </p>
              <p class="text-gray-500 text-xl  mb-2">
              ${status}
            </p> 
              <button type="button" class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" id=${id} onclick='getId(this)' value='close'>Watch</button>
              <button type="button" class=" inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" id=${id} onclick='remove(this)'>Delete</button></div>
          </div>
        </div>`)
}

async function get_data(url) {
  var id = url.match(/[-\w]{11}/)
  const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
  const data = await res.json();
  const datatitle = await data.title
  const datavtuber = await data.author_name
  const datachannel = await data.author_url
  var day = new Date();
  var year = day.getFullYear();
  var month = day.getMonth();
  var day = day.getDate();
  var today = `${year} ${month + 1}/${day}`
  const cors = await fetch(`https://cors-proxy-62vy.onrender.com/https://img.youtube.com/vi/${id}/maxresdefault.jpg`)
  const blob = await cors.blob();
  var reader = new FileReader();
  reader.onloadend = function () {
    let base64 = reader.result;
    let datas = {
      'url': url,
      'status': 'unwatched',
      'day': today,
      'title': datatitle,
      'vtuber': datavtuber,
      'channel': datachannel,
      'id': id,
      'image': base64
    }
    let val = JSON.stringify(datas);
    localStorage.setItem(url.match(/[-\w]{11}/), val);
    showMenu(true)
    document.getElementById('status').innerHTML = 'アーカイブのURLを追加'
    location.reload();

  }
  reader.readAsDataURL(blob)
}

function text(e) {
  if (e.keyCode === 13) {
    if (form.value.match(/(?<!=\")\b(?:https?):\/\/(?:www\.)?(?:youtube\.com|m.youtube\.com)\/[\w!?/+\-|:=~;.,*&@#$%()'"[\]]+/g)) {
      get_data(form.value);
    }
  } else {
    document.getElementById('status').innerHTML = '正しいYoutubeURLを入力してください!'
  }

}


getId = function (el) {
  if (el.value == "close") {
    el.value = "open";
    let target = document.getElementById(el.id).parentElement.parentElement
    window.open(`https://www.youtube.com/watch?v=${object[el.id].url.match(/[-\w]{11}/)}`, '_blank')
    target.insertAdjacentHTML("beforeend", `<iframe height='250' width='350' src="https://www.youtube.com/embed/${object[el.id].url.match(/[-\w]{11}/)}" title="YouTube video player" id='youtube${el.id}' frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
    document.getElementById(el.id).innerHTML = 'close'
  } else {
    el.value = "close";
    document.getElementById(`youtube${el.id}`).remove();
    document.getElementById(el.id).innerHTML = 'watch'
  }
  let status = JSON.parse(localStorage.getItem(el.id));
  status.status = 'watched'
  let statusdata = JSON.stringify(status);
  localStorage.setItem(el.id, statusdata);
}


remove = function (el) {
  localStorage.removeItem(el.id);
  let target = document.getElementById(el.id).parentElement.parentElement.parentElement
  target.remove();
}