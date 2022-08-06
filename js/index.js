function start() {
  main = document.getElementById('main')
  object = {};
  for (let i = 0; i < localStorage.length; i++) {
    object[i] = JSON.parse(localStorage.getItem(i));
  }
  console.log(object)
  console.log(localStorage)
  card = document.getElementById('cardarea')
  form = document.getElementById('large-input');
  form.addEventListener('keypress', text);
  document.getElementById('hello').innerHTML = `こんにちは　${localStorage.length}個のアーカイブがあります`

  for (let i = 0; i < Object.keys(object).length; i++) {
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${object[i].url.match(/[-\w]{11}/)}&format=json`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        var title = data.title
        var vtuber = data.author_name
        let status = object[i].status
        card.insertAdjacentHTML("beforeend", `<div class="flex justify-center p-10">
        <div class="rounded-lg shadow-lg bg-white max-w-sm">
          <a href="#!" data-mdb-ripple="true" data-mdb-ripple-color="light">
            <img class="rounded-t-lg" src="https://img.youtube.com/vi/${object[i].url.match(/[-\w]{11}/)}/maxresdefault.jpg" alt=""/>
          </a>
          <div class="p-6">
            <h5 class="text-gray-900 ">${title}</h5>
            <p class="text-gray-700 text-base mb-4">
              ${vtuber}
            </p>
            <p class="text-gray-500 text-xl  mb-2">
            ${status}
          </p>
            <button type="button" class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" id=${i} onclick='getId(this)' value='close'>Watch</button>
            <button type="button" class=" inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" id=${i} onclick='remove(this)'>Delete</button></div>
        </div>
      </div>`)
      });
  }

  function text(e) {
    if (e.keyCode === 13) {
      if (form.value.match(/(?<!=\")\b(?:https?):\/\/(?:www\.)?(?:youtube\.com|m.youtube\.com)\/[\w!?/+\-|:=~;.,*&@#$%()'"[\]]+/g)) {
        let data = {
          'url': form.value,
          'status': 'unwatched',
          'time': '0'
        }
        let val = JSON.stringify(data);
        localStorage.setItem(localStorage.length, val);
        showMenu(true)
        document.getElementById('status').innerHTML = 'アーカイブのURLを追加'
        location.reload();
      } else {
        document.getElementById('status').innerHTML = '正しいYoutubeURLを入力してください!'
      }


    }
  }
}
setTimeout(start, 1000)

getId = function (el) {
  if (el.value == "close") {
    el.value = "open";
    let target = document.getElementById(el.id).parentElement.parentElement
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
  console.log(`deleted${el.id}`)
  let target = document.getElementById(el.id).parentElement.parentElement.parentElement
  target.remove();
}
