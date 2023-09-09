console.log('Script yüklendi...')

function getCookie(name){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) return parts.pop().split(';').shift();
}

function saveChanges(button) {
const postId = button.getAttribute('data-post-id');
const textAreaValue = document.getElementById(`textarea_${postId}`).value;
const content = document.getElementById(`content_${postId}`);
const modal = document.getElementById(`modal_edit_post_${postId}`);
fetch(`/edit/${postId}`, {
    method: "POST",
    headers: {"Content-type": "application/json", "X-CSRFToken": getCookie("csrftoken")},
    body: JSON.stringify( {
        content: textAreaValue
    })
})
.then(response => response.json())
.then(result => {
    content.innerHTML = result.data;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('style', 'display: none');

    const modalsBackdrops = document.getElementsByClassName('modal-backdrop');
    for(let i=0; i<modalsBackdrops.length; i++){
        document.body.removeChild(modalsBackdrops[i]);
    }
})
}

let whoYouLiked = [];

function LikeHandler(id) {
let btn = document.getElementById(`${id}`);

if (whoYouLiked.indexOf(id) >= 0) {
    fetch(`/like_remove/${id}`)
        .then(response => response.json())
        .then(result => {
            btn.classList.remove('fa-thumbs-down');
            btn.classList.add('fa-thumbs-up'); // Like yapıldığında butonu "fa-thumbs-up" olarak değiştir
            // whoYouLiked dizisini güncelle 
            whoYouLiked.splice(whoYouLiked.indexOf(id), 1); // Beğeni kaldır
        });
} else {
    fetch(`/like_add/${id}`)
        .then(response => response.json())
        .then(result => {
            btn.classList.remove('fa-thumbs-up');
            btn.classList.add('fa-thumbs-down'); // Unlike yapıldığında butonu "fa-thumbs-down" olarak değiştir
            // whoYouLiked dizisini güncelle
            whoYouLiked.push(id); // Beğeni ekle
        });
}
}


// Bu fonksiyon, textarea'ya tıkladığınızda veya odaklandığınızda varsayılan metni siler
function clearDefaultText(textarea) {
    if (textarea.value === "Write your post 😍") {
        textarea.value = "";
    }
}

// Bu fonksiyon, textarea odak kaybettiğinde ve içerik boşsa varsayılan metni geri ekler
function restoreDefaultText(textarea) {
    if (textarea.value.trim() === "") {
        textarea.value = "Write your post 😍";
    }
}

// Bu fonksiyon, textarea boşsa veya varsayılan metni içeriyorsa göndermeyi engeller
function checkEmpty(textarea) {
    if (textarea.value.trim() === "" || textarea.value === "Write your post 😍") {
        alert("Post content cannot be empty! or Post content cannot be same!");
        return false;
    }
    return true;
}


function deletePost(postId) {
const confirmation = confirm("Are you sure you want to delete this post?");
if (confirmation) {
    fetch(`/delete_post/${postId}/`, {
        method: "DELETE",
        headers: {"X-CSRFToken": getCookie("csrftoken")}
    })
    .then(response => {
        if (response.status === 200) {
            // Gönderi başarıyla silindiğinde sayfayı yeniden yükle
            window.location.reload();
        } else if (response.status === 403) {
            alert("You are not authorized to delete this post.");
        } else {
            alert("Failed to delete post.");
        }
    })
    .catch(error => {
        console.error("An error occurred:", error);
        alert("An error occurred while deleting the post.");
    });
}
}


// Emoji verilerini çekmek için bir AJAX isteği yapın
fetch('/get_emojis/')
    .then(response => response.json())
    .then(data => {
        // Verileri alın ve modal içindeki liste için kullanın
        const emojiListInModal = document.getElementById("emojiListInModal");

        // Örnek emoji kodlarını bir dizi içinde tutun
        const emojis = [ "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "☠️", "👻", "👽", "👾", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "🤷", "🤶", "🤵", "🤴", "👸", "🧙‍♀️", "🧙‍♂️", "🧚‍♀️", "🧚‍♂️", "🧛‍♀️", "🧛‍♂️", "🧜‍♀️", "🧜‍♂️", "🧝‍♀️", "🧝‍♂️", "🧞‍♀️", "🧞‍♂️", "🧟‍♀️", "🧟‍♂️", "💆‍♀️", "💆‍♂️", "💇‍♀️", "💇‍♂️", "💅", "👩‍🦽", "👨‍🦽", "👩‍🦼", "👨‍🦼", "🚶‍♀️", "🚶‍♂️", "🏃‍♀️", "🏃‍♂️", "🐵", "🙈", "🙉", "🎃", "🎄", "🎆", "🎇", "🧨", "✨", "🎈", "🎉", "🎊", "🎋", "🎍", "🎎", "🎏", "🎐", "🎑", "🧧", "🎁", "🎟️", "🎫", "🏮", "🪔", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "⚾", "🥎", "🏀", "🏐", "🏈", "🏉", "🎾", "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎯", "🪀", "🪁", "🎱", "🔮",  "🎮", "🕹️", "🎰", "🎲", "🧩", "♠️", "♥️", "♦️", "♣️", "♟️", "🃏", "🀄", "🎴", "🎭", "🖼️", "🎨", "🔫", "🌍", "🌎", "🌏", "🌐", "🗺️", "🗾", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️",
        "🏟️", "🏛️", "🏗️", "🧱", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", "🎡", "🎢", "💈", "🎪", "🛎️", "🗿",
        "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🚏", "🛣️", "🛤️", "🛢️", "⛽", "🚨", "🚥", "🚦", "🛑", "🚧",
        "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🎀", "🎗️", "👓", "🕶️", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🛍️", "🎒", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "⛑️", "📿", "💄", "💍", "💎", "🦯",
        "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕", "🎼", "🎵", "🎶", "🎙️", "🎚️", "🎛️", "🎤", "🎧", "📻", "🎷", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁",
        "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🎥", "🎞️", "📽️", "🎬", "📺", "📷", "📸", "📹", "📼",
        "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️",
        "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦", "🧮", "💰", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "💹",
        "💣", "🧳", "🌡️", "🧸", "🧶", "🔍", "🔎", "🕯️", "💡", "🔦", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "🏹", "🛡️", "🔧", "🔩", "⚙️", "🗜️", "⚖️", "🔗", "⛓️", "🧰", "🧲", "⚗️", "🧪", "🧫", "🔬", "🔭", "📡", "💉", "🩹", "🩺", "🚪", "🛏️", "🛋️", "🪑", "🚽", "🚿", "🛁", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🧼", "🧽", "🧯",
        "🧯", "🛒", "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️",];


    // Her emoji için döngü oluşturun
    emojis.forEach(emoji => {
        const listItem = document.createElement("li");
        listItem.textContent = emoji;
        listItem.addEventListener("click", () => addEmojiToTextarea(emoji));
        emojiListInModal.appendChild(listItem);
    });

        // API'den gelen emoji listesini ekle
        data.emojis.forEach(emoji => {
            const listItem = document.createElement("li");
            listItem.textContent = `${emoji.character}`;
            listItem.addEventListener("click", () => addEmojiToTextarea(emoji.character));
            emojiListInModal.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error("API'den veri alınamadı:", error);
    });

// Seçilen emojiyi textarea'ya eklemek için işlev
function addEmojiToTextarea(emoji) {
    const textarea = document.getElementById("postContent");
    const emojiListInModal = document.getElementById("emojiListInModal");

// Emojiye tıkladığınızda animasyonu başlatın
emojiListInModal.style.pointerEvents = "none"; // Diğer tıklamaları engellemek için
emojiListInModal.style.opacity = "0.5"; // Opaklığı düşürün

// Mevcut metni ve seçilen emojiyi birleştirin
const currentText = textarea.value;
const newText = currentText === "Write your post 😍" ? emoji : currentText + emoji;
textarea.value = newText;

// 200 milisaniye sonra animasyonu geri alın
setTimeout(() => {
    emojiListInModal.style.pointerEvents = "auto"; // Diğer tıklamaları tekrar etkinleştirin
    emojiListInModal.style.opacity = "1"; // Opaklığı geri alın
}, 200);
}