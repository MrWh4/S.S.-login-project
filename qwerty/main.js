// DOM elementlarini olish
document.addEventListener('DOMContentLoaded', function() {
    // Foydalanuvchi formasi
    const userForm = document.getElementById('userForm');
    const userPhotoInput = document.getElementById('userPhoto');
    const passportInput = document.getElementById('passport');
    const photoPreview = document.getElementById('photoPreview');
    const passportPreview = document.getElementById('passportPreview');
    const successMessage = document.getElementById('successMessage');
    
    // Admin paneli
    const adminLogin = document.getElementById('adminLogin');
    const adminPanel = document.getElementById('adminPanel');
    const loginBtn = document.getElementById('loginBtn');
    const adminPassword = document.getElementById('adminPassword');
    const usersList = document.getElementById('usersList');
    const searchInput = document.getElementById('searchInput');
    
    // Foydalanuvchilar ma'lumotlarini saqlash uchun
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Admin paroli (haqiqiy loyihada bu yerda saqlanmasligi kerak)
    const ADMIN_PASSWORD = 'admin123';
    
    // Rasm preview ko'rsatish
    if (userPhotoInput) {
        userPhotoInput.addEventListener('change', function(e) {
            previewImage(e.target.files[0], photoPreview);
        });
    }
    
    if (passportInput) {
        passportInput.addEventListener('change', function(e) {
            previewImage(e.target.files[0], passportPreview);
        });
    }
    
    // Rasm preview funksiyasi
    function previewImage(file, container) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            container.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
    
    // Foydalanuvchi formasi yuborilganda
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form ma'lumotlarini olish
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const phone = document.getElementById('phone').value;
            
            // Rasmlarni base64 formatda olish
            const userPhotoFile = userPhotoInput.files[0];
            const passportFile = passportInput.files[0];
            
            // Rasmlarni o'qish va ma'lumotlarni saqlash
            const userPhotoReader = new FileReader();
            userPhotoReader.onload = function(e) {
                const userPhotoBase64 = e.target.result;
                
                const passportReader = new FileReader();
                passportReader.onload = function(e) {
                    const passportBase64 = e.target.result;
                    
                    // Yangi foydalanuvchi ma'lumotlarini yaratish
                    const newUser = {
                        id: Date.now(),
                        firstName,
                        lastName,
                        phone,
                        photo: userPhotoBase64,
                        passport: passportBase64,
                        date: new Date().toLocaleString()
                    };
                    
                    // Ma'lumotlarni saqlash
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));
                    
                    // Formani tozalash
                    userForm.reset();
                    photoPreview.innerHTML = '';
                    passportPreview.innerHTML = '';
                    
                    // Muvaffaqiyatli xabar ko'rsatish
                    successMessage.style.display = 'block';
                    
                    // 3 soniyadan keyin xabarni yashirish
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 3000);
                };
                passportReader.readAsDataURL(passportFile);
            };
            userPhotoReader.readAsDataURL(userPhotoFile);
        });
    }
    
    // Admin login
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (adminPassword.value === ADMIN_PASSWORD) {
                adminLogin.style.display = 'none';
                adminPanel.style.display = 'block';
                
                // Foydalanuvchilar ro'yxatini ko'rsatish
                displayUsers(users);
            } else {
                alert('Noto\'g\'ri parol!');
            }
        });
    }
    
    // Qidirish funksiyasi
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredUsers = users.filter(user => 
                user.firstName.toLowerCase().includes(searchTerm) || 
                user.lastName.toLowerCase().includes(searchTerm) || 
                user.phone.includes(searchTerm)
            );
            
            displayUsers(filteredUsers);
        });
    }
    
    // Foydalanuvchilar ro'yxatini ko'rsatish
    function displayUsers(usersArray) {
        if (!usersList) return;
        
        if (usersArray.length === 0) {
            usersList.innerHTML = `
                <div class="no-users animate__animated animate__fadeIn">
                    <i class="fas fa-users-slash"></i>
                    <p>Hozircha foydalanuvchilar yo'q</p>
                </div>
            `;
            return;
        }
        
        usersList.innerHTML = '';
        
        usersArray.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card animate__animated animate__fadeIn';
            
            userCard.innerHTML = `
                <h3>${user.firstName} ${user.lastName}</h3>
                <p><i class="fas fa-phone"></i> ${user.phone}</p>
                <p><i class="fas fa-calendar-alt"></i> ${user.date}</p>
                <div class="user-images">
                    <div class="user-image">
                        <img src="${user.photo}" alt="${user.firstName}'s photo" onclick="openImageModal(this.src, 'Foydalanuvchi rasmi')">
                    </div>
                    <div class="user-image">
                        <img src="${user.passport}" alt="${user.firstName}'s passport" onclick="openImageModal(this.src, 'Passport')">
                    </div>
                </div>
            `;
            
            usersList.appendChild(userCard);
        });
    }
    
    // Rasmni kattalashtirish uchun modal
    window.openImageModal = function(src, title) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close" onclick="closeModal(this)">
                    <i class="fas fa-times"></i>
                </div>
                <h3>${title}</h3>
                <img src="${src}" alt="${title}" class="modal-image">
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Modal animatsiyasi
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    };
    
    window.closeModal = function(element) {
        const modal = element.closest('.modal');
        modal.classList.remove('active');
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    };
});
