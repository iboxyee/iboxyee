let currentUrl = '';

async function viewSource() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Silakan masukkan URL!' });
        return;
    }

    try {
        const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`);
        let html = await response.text();

        const urlObject = new URL(url.startsWith('http') ? url : `http://${url}`);
        const hostname = urlObject.hostname;

        html = html.replace(/(["'])(\/[^"']*)\1/g, `$1https://${hostname}$2$1`);

        html = html.replace(/(["'])(https?:\/\/[^"'\s]+?\.(jpg|jpeg|png|gif|webp|mp4|webm|avi|mov|mkv))\1/gi, 
            (match, p1, p2) => `${p1}https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(p2)}${p1}`
        );

        document.getElementById('sourceOutput').textContent = html;
        Prism.highlightElement(document.getElementById('sourceOutput'));

        currentUrl = url;
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Gagal mengambil URL.' });
        console.error(error);
    }
}

function downloadSource() {
    const text = document.getElementById('sourceOutput').textContent;
    if (!text) {
        Swal.fire({ icon: 'warning', title: 'Tidak Ada Data', text: 'Tidak ada data untuk diunduh!' });
        return;
    }
    const blob = new Blob([text], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'source.html';
    a.click();
    URL.revokeObjectURL(url);
}

function copySource() {
    const text = document.getElementById('sourceOutput').textContent;
    if (!text) {
        Swal.fire({ icon: 'warning', title: 'Tidak Ada Data', text: 'Tidak ada data untuk disalin!' });
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({ icon: 'success', title: 'Disalin!', text: 'Teks berhasil disalin!' });
    }).catch(err => console.error('Gagal menyalin:', err));
}

function openLightbox() {
    if (!currentUrl) {
        Swal.fire({ icon: 'warning', title: 'Tidak Ada URL', text: 'Lihat source URL terlebih dahulu!' });
        return;
    }
    document.getElementById('lightboxIframe').src = currentUrl;
    document.getElementById('lightbox').classList.add('show');
}

function closeLightbox() {
    document.getElementById('lightboxIframe').src = '';
    document.getElementById('lightbox').classList.remove('show');
}
