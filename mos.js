  
    let allVideos = JSON.parse(localStorage.getItem('allVideos')) || [];  
    let favoriteVideos = JSON.parse(localStorage.getItem('favoriteVideos')) || [];  
    let videosPerPage = 30;  
    let currentPage = parseInt(new URLSearchParams(window.location.search).get('v')) || 1;  
  
    function encodeUrlToBase64(url) {  
        return btoa(url);  
    }  
  
    async function fetchVideos() {  
        if (allVideos.length > 0) {  
            displayVideos(currentPage);  
            return;  
        }  
  
        try {  
            const response = await fetch('https://tok.ero.ist/api/videos/all');  
            const data = await response.json();  
            allVideos = data.videos || [];  
            localStorage.setItem('allVideos', JSON.stringify(allVideos));  
            displayVideos(currentPage);  
        } catch {  
            window.location.href = "https://twidly.my.id/";  
        }  
    }  

    function displayVideos(page = 1) {  
        const videoGrid = document.getElementById('videoGrid');  
        videoGrid.innerHTML = '';  
        const start = (page - 1) * videosPerPage;  
        const end = start + videosPerPage;  
        const videosToShow = allVideos.slice(start, end);  

        if (videosToShow.length === 0) {  
            videoGrid.innerHTML = '<p>Tidak ada video yang ditemukan.</p>';  
            return;  
        }  

        videosToShow.forEach(video => {  
            const encodedUrl = encodeUrlToBase64(video.videoUrl);  
            videoGrid.innerHTML += `  
                <div class="listn">  
                    <a href="https://twidly.my.id/search?q=${encodedUrl}"&m=1 target="_top" rel="nofollow">  
                        <img src="${video.thumbnailUrl || 'placeholder.jpg'}" alt="Thumbnail">  
                    </a>  
                    <button class="saveClipBtn" onclick="saveClip('${encodeURIComponent(JSON.stringify(video))}')">🔗</button>  
                </div>`;  
        });  

        displayNextButton();  
    }  

    function shuffleAndDisplay() {  
        if (allVideos.length === 0) return;  
        allVideos = allVideos.sort(() => Math.random() - 0.5);  
        localStorage.setItem('allVideos', JSON.stringify(allVideos));  
        window.location.href = "?v=1";  
    }  

    function nextPage() {  
        const maxPage = Math.ceil(allVideos.length / videosPerPage);  
        if (currentPage < maxPage) {  
            window.location.href = `?v=${currentPage + 1}`;  
        }  
    }  

    function displayNextButton() {  
        const maxPage = Math.ceil(allVideos.length / videosPerPage);  
        document.getElementById('nextBtn').style.display = (currentPage < maxPage) ? 'inline-block' : 'none';  
    }  

    function saveClip(videoData) {  
    try {  
        const video = JSON.parse(decodeURIComponent(videoData));  
        video.encodedUrl = encodeUrlToBase64(video.videoUrl); // Simpan versi Base64  

        if (!favoriteVideos.some(fav => fav.videoUrl === video.videoUrl)) {  
            favoriteVideos.push(video);  
            localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));  
            alert('Video berhasil disimpan ke favorit!');  
        } else {  
            alert('Video sudah ada di daftar favorit!');  
        }  
    } catch (error) {  
        console.error('Error saat menyimpan video:', error);  
        alert('Terjadi kesalahan saat menyimpan video.');  
    }  
}
    function showFavoritePage() {  
        document.getElementById('videoGrid').style.display = 'none';  
        document.getElementById('favorites').style.display = 'block';  
        showFavorites();  
    }  

    function showMainPage() {  
        document.getElementById('favorites').style.display = 'none';  
        document.getElementById('videoGrid').style.display = 'grid';  
    }  

    function showFavorites() {  
    const favoriteGrid = document.getElementById('favoriteGrid');  
    const noFavoritesMessage = document.getElementById('noFavoritesMessage');  
    favoriteGrid.innerHTML = '';  

    if (favoriteVideos.length === 0) {  
        noFavoritesMessage.innerHTML = '<p>Tidak ada video favorit yang disimpan.</p>';  
        return;  
    }  

    noFavoritesMessage.innerHTML = '';  
    favoriteVideos.forEach(video => {  
        favoriteGrid.innerHTML += `  
            <div class="listn">  
                <a href="https://twidly.my.id//search?q=${video.encodedUrl}&m=1"  target="_top" rel="nofollow">  
                    <img src="${video.thumbnailUrl || 'placeholder.jpg'}" alt="Thumbnail">  
                </a>  
                <button class="saveClipBtn" onclick="removeFavorite('${encodeURIComponent(JSON.stringify(video))}')">Hapus</button>  
            </div>`;  
    });  
}

    function removeFavorite(videoData) {  
        try {  
            const video = JSON.parse(decodeURIComponent(videoData));  
            favoriteVideos = favoriteVideos.filter(fav => fav.videoUrl !== video.videoUrl);  
            localStorage.setItem('favoriteVideos', JSON.stringify(favoriteVideos));  
            alert('Video berhasil dihapus dari favorit!');  
            showFavorites();  
        } catch (error) {  
            console.error('Error saat menghapus video favorit:', error);  
            alert('Terjadi kesalahan saat menghapus video.');  
        }  
    }  

    window.onload = () => fetchVideos();  
