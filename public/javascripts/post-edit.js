 // formTagのidを取得
 let postEditForm = document.getElementById('postEditForm');
 postEditForm.addEventListener('submit', function(event){
     // ファイル選択数
    let imageUploads = document.getElementById('imageUpload').files.length;
    // エディット対象画像数
    let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;
    // 削除する際のチェックされた画像数
    let imgDeletions= document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // 一回の最大投稿数
    let newTotal = existingImages - imgDeletions + imageUploads
    if ( newTotal > 4) {
        event.preventDefault()
        alert(`少なくとも${newTotal -4}枚の画像を削除する必要があります`)
 }
 })