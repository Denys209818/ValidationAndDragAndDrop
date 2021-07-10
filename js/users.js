var number = 1;
    const regex_email = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    const regex_phone = /^(?=\+?([0-9]{2})\(?([0-9]{3})\)\s?([0-9]{3})\s?([0-9]{2})\s?([0-9]{2})).{18}$/;
window.onload = function () {

    var txtName = document.getElementById('txtName');
    var txtLastname = document.getElementById('txtLastname');
    var txtPhone = document.getElementById('txtPhone');
    var txtMail = document.getElementById('txtMail');
    var txtPhoto = document.getElementById('txtPhoto');
    var inputImgHidden = document.getElementById('inputImgHidden');
    var txtPhotoBlock = document.getElementById('txtPhotoBlock');
    var imgFailP = document.getElementById('imgFailP');

    var btnSaveChanges = document.getElementById('btnSaveChanges');
    var userBody = document.getElementById('userBody');
    var mainForm = document.getElementById('mainForm');


    var closeModal = document.getElementById('closeModal');
    closeModal.onclick = RemoveValidation;

    var imgModal = document.getElementById('imgModal');

    btnSaveChanges.onclick = btnSaveChangesClick;

    var inputMask = IMask(txtPhone, {
        mask: "+00(000) 000 00 00"
    });

    txtName.oninput = ValidText;
    txtLastname.oninput = ValidText;
    txtMail.oninput = ValidEmail;
    txtPhone.oninput = ValidPhone;
    txtPhoto.oninput = ValidImage;


    function ValidText(e)
    {
        if (e.target.value == "") {

            Fail(e.target);
        }
        else
        {
            Success(e.target);     
        }
    }

    function ValidEmail(e)
    {
        if (!regex_email.test(e.target.value)) {
            Fail(e.target);
        } else
        {
            Success(e.target);
        }
    }

    function ValidPhone(e) {
        if (!regex_phone.test(e.target.value)) {
            Fail(e.target);
        } else {
            Success(e.target);
        }
    }

    function ValidImage(e)
    {
        isValidImage(e.target);
    }

    function isValidImage(image)
    {
        var img = image;
        var collFiles = img.files;
        if (collFiles && collFiles[0]) {
            var file = collFiles[0];
            if (file.type.match(/^image\//)) {
                var fileReader = new FileReader();

                fileReader.onload = function () {
                    var base64 = fileReader.result;
                    imgModal.src = base64;
                    inputImgHidden.value = base64;
                    Success(txtPhotoBlock);
                }

                fileReader.readAsDataURL(file);

            }
            else {

                imgModal.src = "/images/no-image.png";
                Fail(txtPhotoBlock);
            }
        }
    }


    //DragAndDrop

    var draganddrop = document.getElementById('draganddrop');
    draganddrop.addEventListener('dragenter', DragIn, false);
    draganddrop.addEventListener('dragover', DragIn, false);

    draganddrop.addEventListener('dragleave', DragOut, false);
    draganddrop.addEventListener('drop', DragOut, false);


    draganddrop.addEventListener('dragenter', PreventDefaults, false);
    draganddrop.addEventListener('dragover', PreventDefaults, false);

    draganddrop.addEventListener('dragleave', PreventDefaults, false);
    draganddrop.addEventListener('drop', PreventDefaults, false);

    draganddrop.addEventListener('drop', SaveImage,false);

    function DragIn(e)
    {
        draganddrop.classList.add('dragIn');
    }

    function DragOut(e)
    {
        draganddrop.classList.remove('dragIn');
    }

    function PreventDefaults(e)
    {
        e.preventDefault();
        e.stopPropagation();
    }

    function SaveImage(e)
    {
        var files;
        if (e.files) {
            files = e.files;
        } else if (e.dataTransfer)
        {
            files = e.dataTransfer.files;
        }
        
        if (files)
        {
            if (files[0])
            {
                var file = files[0];
                txtPhoto.files = files;
                isValidImage(txtPhoto);
            }
        }
    }
}


function btnSaveChangesClick(e) {

    if (isValidation()) {
        $("#mainModal").modal("hide");
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td scope="row">${number++}</td>
            <td><img class="rounded mx-auto d-block" src="${inputImgHidden.value}" width="74" height="64"/></td>
            <td>${txtName.value}</td>
            <td>${txtLastname.value}</td>
            <td>${txtPhone.value}</td>
            <td>${txtMail.value}</td>
            <td><span class="text-danger" onclick="DeleteRow(this)">
                <i class="fa fa-trash fa-2x"></i></span>&nbsp;
                <span class="text-primary" onclick="UpdateRow(this)">
                <i class="fa fa-pencil fa-2x"></i>
                </span></td>
        `;
        RemoveValidation();
        userBody.appendChild(tr);
    }

    e.preventDefault();
}

function RemoveValidation() {
    mainForm.reset();
    imgModal.src = "/images/no-image.png";
    inputImgHidden.value = "";

    txtName.classList.remove("is-valid");
    txtName.classList.remove("is-invalid");

    txtLastname.classList.remove("is-valid");
    txtLastname.classList.remove("is-invalid");

    txtPhone.classList.remove("is-valid");
    txtPhone.classList.remove("is-invalid");

    txtMail.classList.remove("is-valid");
    txtMail.classList.remove("is-invalid");

    txtPhoto.classList.remove("is-valid");
    txtPhoto.classList.remove("is-invalid");

    txtPhotoBlock.classList.remove("is-valid");
    txtPhotoBlock.classList.remove("is-invalid");
}

function DeleteRow(e) {
    var userBody = document.getElementById('userBody');
    var tr = e.parentElement.parentElement;
    //console.log(`${tr.rowIndex}`);
    
    bootbox.confirm(`Ви дійсно бажаєте видалити рядок: ${tr.rowIndex}, Ім'я: ${tr.cells[2].innerHTML}, 
        Прізвище: ${tr.cells[3].innerHTML}`, function (result) {
        if (result) {
            userBody.removeChild(tr);
            updateCount(userBody);
        }
    });
}

function isValidationWithoutImage()
{
    var isValid = true;

    if (txtName.value == "") {

        Fail(txtName);
        isValid = false;
    }
    else {
        Success(txtName);
    }

    if (txtLastname.value == "") {

        Fail(txtLastname);
        isValid = false;
    }
    else {
        Success(txtLastname);
    }

    if (!regex_email.test(txtMail.value)) {
        Fail(txtMail);
        isValid = false;
    } else {
        Success(txtMail);
    }

    if (!regex_phone.test(txtPhone.value)) {
        Fail(txtPhone);
        isValid = false;
    } else {
        Success(txtPhone);
    }
    return isValid;
}

function isValidation() {
    var imgFailP = document.getElementById('imgFailP');
    var isValid = isValidationWithoutImage();

    var img = txtPhoto;
    var collFiles = img.files;
    if (collFiles && collFiles[0]) {
        var file = collFiles[0];
        if (file.type.match(/^image\//)) {
            Success(txtPhotoBlock);
        } else {
            Fail(txtPhotoBlock);
            isValid = false;
        }
    }
    else {
        Fail(txtPhotoBlock);
        isValid = false;
    }

    return isValid;
}

function Fail(inputTag) {
    inputTag.classList.add("is-invalid");
    inputTag.classList.remove("is-valid");
}

function Success(inputTag) {
    inputTag.classList.add("is-valid");
    inputTag.classList.remove("is-invalid");
}

function updateCount(userBody)
    {
        var rows = userBody.rows;
        for (var i = 0; i < rows.length; i++) {
            rows.item(i).cells[0].innerHTML = i + 1;
        }
    number--;
}

function UpdateRow(e)
{
    var txtName = document.getElementById('txtName');
    var txtLastname = document.getElementById('txtLastname');
    var txtPhone = document.getElementById('txtPhone');
    var txtPhoto = document.getElementById('txtPhoto');
    var txtMail = document.getElementById('txtMail');
    var btnSaveChanges = document.getElementById('btnSaveChanges');
    var modalHeader = document.getElementById('modalHeader');
    
    var tr = e.parentElement.parentElement;

    btnSaveChanges.tag = tr;
    btnSaveChanges.onclick = UpdateTableRow;
    modalHeader.innerHTML = "Редагувати користувача";

    var closeModal = document.getElementById('closeModal');
    closeModal.onclick = UpdateTableRowClose;

    txtName.value = tr.cells[2].innerHTML;
    txtName.classList.add('is-valid');

    txtLastname.value = tr.cells[3].innerHTML;
    txtLastname.classList.add('is-valid');

    txtPhone.value = tr.cells[4].innerHTML;
    txtPhone.classList.add('is-valid');

    txtMail.value = tr.cells[5].innerHTML;
    txtMail.classList.add('is-valid');

    imgModal.src = tr.cells[1].firstChild.src;
    txtPhoto.classList.add("is-valid");

    $('#mainModal').modal("show");

    //ReloadModal(e);
}

function ReloadModal(e)
{
    
}

function isValidImageWithoutRequired(txtPhoto)
{
    var isValid = true;
    var imgModal = document.getElementById('imgModal');

    var files = txtPhoto.files;
    if (files && files[0])
    {
        var file = files[0];
        if (!file.type.match(/^image\//))
        {
            isValid = false;
        }
    }

    return isValid;
}

function UpdateTableRow(e)
{
    var txtName = document.getElementById('txtName');
    var txtLastname = document.getElementById('txtLastname');
    var txtPhone = document.getElementById('txtPhone');
    var txtMail = document.getElementById('txtMail');
    var imgModal = document.getElementById('imgModal');

    
    if (isValidationWithoutImage() && isValidImageWithoutRequired(document.getElementById('txtPhoto')))
    {
        var modalHeader = document.getElementById('modalHeader');
        modalHeader.innerHTML = "Додати нового користувача";

        var closeModal = document.getElementById('closeModal');
        closeModal.onclick = RemoveValidation;
        var tr = e.target.tag;
        tr.cells[1].firstChild.src = imgModal.src;
        tr.cells[2].innerHTML = txtName.value;
        tr.cells[3].innerHTML = txtLastname.value;
        tr.cells[4].innerHTML = txtPhone.value;
        tr.cells[5].innerHTML = txtMail.value;

        var btnSaveChanges = document.getElementById('btnSaveChanges');
        btnSaveChanges.onclick = btnSaveChangesClick;
        RemoveValidation();
        $('#mainModal').modal("hide");
    }
}

function UpdateTableRowClose() {
    var modalHeader = document.getElementById('modalHeader');
    modalHeader.innerHTML = "Додати нового користувача";

    var closeModal = document.getElementById('closeModal');
    closeModal.onclick = RemoveValidation;


    var btnSaveChanges = document.getElementById('btnSaveChanges');
    btnSaveChanges.onclick = btnSaveChangesClick;
    RemoveValidation();
    $('#mainModal').modal("hide");
}