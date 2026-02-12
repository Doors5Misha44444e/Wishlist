document.addEventListener('DOMContentLoaded', () => {
 
    const authSection = document.getElementById('auth-section');
    const userSection = document.getElementById('user-section');
    const wishForm = document.getElementById('wish-form');
    const wishSection = document.getElementById('wish-section');
    const friendsSection = document.getElementById('friends-section');
    const chatSection = document.getElementById('chat-section');
    const mainNav = document.getElementById('main-nav');
    const currentUserSpan = document.getElementById('current-user');
    
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const registerUsername = document.getElementById('register-username');
    const registerPassword = document.getElementById('register-password');
    const rememberMeCheckbox = document.getElementById('remember-me');

    const wishName = document.querySelector('#wish-name');
    const wishLink = document.querySelector('#wish-link');
    const wishPrice = document.querySelector('#wish-price');
    const wishList = document.querySelector('#wish-list-container');
    const wishCounter = document.querySelector('#wish-counter');
    const confettiContainer = document.querySelector('#confetti');

    const friendsContainer = document.getElementById('friends-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInputGroup = document.getElementById('chat-input-group');
    const messageInput = document.getElementById('message-input');
    const chatHeader = document.getElementById('chat-header');
    
 
    const customCursor = document.getElementById('custom-cursor');
    

    let currentUser = null;
    let currentChatFriend = null;
    let users = JSON.parse(localStorage.getItem('cosmicUsers')) || {};
    let wishes = [];
    let editingWishId = null;
    
    const cosmicEmojis = ['✨', '🌟', '💫', '🎇', '🎆', '💎', '🎯', '🎁', '💖', '🚀'];
    

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }
    
    checkAuth();
    initCustomCursor();
    
  
    function initCustomCursor() {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });
        
    
        const buttons = document.querySelectorAll('button, .shop-btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                customCursor.style.filter = 'drop-shadow(0 0 15px #FFD700)';
            });
            btn.addEventListener('mouseleave', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
                customCursor.style.filter = 'drop-shadow(0 0 5px #FFD700)';
            });
        });
    }
    

    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            loginForm.classList.add('hidden');
            registerForm.classList.add('hidden');
            
            if (tabName === 'login') {
                loginForm.classList.remove('hidden');
            } else {
                registerForm.classList.remove('hidden');
            }
        });
    });
    
 
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            wishSection.classList.add('hidden');
            friendsSection.classList.add('hidden');
            chatSection.classList.add('hidden');
            
            if (tabName === 'my-wishes') {
                wishSection.classList.remove('hidden');
                wishForm.classList.remove('hidden');
            } else if (tabName === 'friends') {
                friendsSection.classList.remove('hidden');
                wishForm.classList.add('hidden');
                renderFriends();
            } else if (tabName === 'chat') {
                chatSection.classList.remove('hidden');
                wishForm.classList.add('hidden');
                renderChatList();
            }
        });
    });
    
   
    function checkAuth() {
       
        const cookieUser = getCookie('cosmicUser');
        if (cookieUser && users[cookieUser]) {
            currentUser = cookieUser;
            wishes = users[cookieUser].wishes || [];
            showApp();
            showMessage('🍪 Автовхід через cookie!', 'success');
            return;
        }
        
       
        const savedUser = localStorage.getItem('cosmicUser');
        if (savedUser && users[savedUser]) {
            currentUser = savedUser;
            wishes = users[savedUser].wishes || [];
            showApp();
        } else {
            showAuth();
        }
    }
    
    function showAuth() {
        authSection.classList.remove('hidden');
        userSection.classList.add('hidden');
        wishForm.classList.add('hidden');
        wishSection.classList.add('hidden');
        friendsSection.classList.add('hidden');
        chatSection.classList.add('hidden');
        mainNav.classList.add('hidden');
    }
    
    function showApp() {
        authSection.classList.add('hidden');
        userSection.classList.remove('hidden');
        wishForm.classList.remove('hidden');
        wishSection.classList.remove('hidden');
        mainNav.classList.remove('hidden');
        currentUserSpan.textContent = currentUser;
        renderWishes();
    }
    
    window.loginUser = function() {
        const username = loginUsername.value.trim();
        const password = loginPassword.value;
        const remember = rememberMeCheckbox.checked;
        
        if (!username || !password) {
            shakeInput(loginUsername);
            shakeInput(loginPassword);
            showMessage('❌ Заповни всі космічні поля!', 'error');
            return;
        }
        
        if (users[username] && users[username].password === password) {
            currentUser = username;
            
            if (remember) {
                setCookie('cosmicUser', username, 7); // 7 днів
                showMessage('🍪 Сесію збережено в cookie!', 'success');
            } else {
                localStorage.setItem('cosmicUser', username);
            }
            
            wishes = users[username].wishes || [];
            loginUsername.value = '';
            loginPassword.value = '';
            rememberMeCheckbox.checked = false;
            showApp();
            createConfetti();
            showMessage('🚀 Успішний вхід в космічну систему!', 'success');
        } else {
            shakeInput(loginUsername);
            shakeInput(loginPassword);
            showMessage('❌ Неправильний логін або пароль!', 'error');
        }
    };
    
    window.registerUser = function() {
        const username = registerUsername.value.trim();
        const password = registerPassword.value;
        
        if (!username || !password) {
            shakeInput(registerUsername);
            shakeInput(registerPassword);
            showMessage('❌ Заповни всі космічні поля!', 'error');
            return;
        }
        
        if (users[username]) {
            shakeInput(registerUsername);
            showMessage('❌ Це космічне імʼя вже зайняте!', 'error');
            return;
        }
        
        users[username] = {
            password: password,
            wishes: [],
            friends: [],
            messages: {}
        };
        
        localStorage.setItem('cosmicUsers', JSON.stringify(users));
        currentUser = username;
        localStorage.setItem('cosmicUser', username);
        wishes = [];
        registerUsername.value = '';
        registerPassword.value = '';
        showApp();
        createConfetti();
        showMessage('🎉 Космічний акаунт створено! Автовхід виконано!', 'success');
    };
    
    window.logoutUser = function() {
        currentUser = null;
        wishes = [];
        localStorage.removeItem('cosmicUser');
        deleteCookie('cosmicUser');
        showAuth();
        showMessage('👋 До зустрічі в космосі!', 'info');
    };
    
    function shakeInput(input) {
        input.style.animation = 'shake 0.5s';
        input.style.borderColor = '#e76f51';
        setTimeout(() => {
            input.style.animation = '';
            input.style.borderColor = '';
        }, 500);
    }
    
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 15px;
            font-weight: 600;
            z-index: 3000;
            animation: slideInRight 0.5s ease-out;
            backdrop-filter: blur(10px);
            border: 2px solid;
        `;
        
        if (type === 'error') {
            messageDiv.style.background = 'rgba(231, 111, 81, 0.9)';
            messageDiv.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            messageDiv.style.color = '#fff';
        } else if (type === 'success') {
            messageDiv.style.background = 'rgba(78, 205, 196, 0.9)';
            messageDiv.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            messageDiv.style.color = '#fff';
        } else {
            messageDiv.style.background = 'rgba(255, 215, 0, 0.9)';
            messageDiv.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            messageDiv.style.color = '#2A0845';
        }
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 500);
        }, 3000);
    }
    

    function updateCounter() {
        const count = wishes.length;
        if (count === 0) {
            wishCounter.textContent = '🌌 Поки порожньо...';
        } else if (count === 1) {
            wishCounter.textContent = '⭐ 1 космічне бажання';
        } else if (count < 5) {
            wishCounter.textContent = `🌟 ${count} космічних бажання`;
        } else {
            wishCounter.textContent = `💫 ${count} космічних бажань`;
        }
    }
    
    function renderWishes() {
        wishList.innerHTML = '';
        
        if (wishes.length === 0) {
            wishList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🌠</div>
                    <p>Додай своє перше космічне бажання!</p>
                </div>
            `;
            updateCounter();
            return;
        }
        
        wishes.forEach((wish, index) => {
            const priceHTML = wish.price ? 
                `<div class="price">${wish.price} грн</div>` : '';
            
            const linkHTML = wish.link ? 
                `<a class="shop-btn" target="_blank" href="${wish.link}">🛒 Перейти до магазину</a>` : '';
            
            const wishHTML = `
                <div class="wish-item" data-id="${wish.id}" style="animation-delay: ${index * 0.1}s">
                    <h3>${wish.name}</h3>
                    ${priceHTML}
                    ${linkHTML}
                    <div class="wish-actions">
                        <button class="edit-btn" onclick="editWish('${wish.id}')">✏️ Редагувати</button>
                        <button class="delete-btn" onclick="deleteWish('${wish.id}')">🗑️ Видалити</button>
                    </div>
                </div>
            `;
            wishList.innerHTML += wishHTML;
        });
        
        updateCounter();
    }
    
    wishForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = wishName.value.trim();
        if (!name) {
            shakeInput(wishName);
            showMessage('❌ Назва бажання не може бути порожньою!', 'error');
            return;
        }
        
        const newWish = {
            id: Date.now().toString(),
            name: name,
            link: wishLink.value.trim(),
            price: wishPrice.value ? parseFloat(wishPrice.value) : null
        };
        
        wishes.unshift(newWish);
        saveWishes();
        renderWishes();
        wishForm.reset();
        
        createConfetti();
        showMessage('✨ Космічне бажання додано!', 'success');
        wishName.focus();
    });
    

    window.editWish = function(id) {
        const wish = wishes.find(w => w.id === id);
        if (!wish) return;
        
        editingWishId = id;
        editName.value = wish.name;
        editLink.value = wish.link || '';
        editPrice.value = wish.price || '';
        
        editModal.classList.remove('hidden');
        showMessage('✏️ Редагування космічного бажання...', 'info');
    };
    
    window.deleteWish = function(id) {
        if (!confirm('❓ Точно видалити це космічне бажання?')) return;
        
        const wishElement = document.querySelector(`[data-id="${id}"]`);
        if (wishElement) {
            wishElement.classList.add('deleting');
            
            setTimeout(() => {
                wishes = wishes.filter(w => w.id !== id);
                saveWishes();
                renderWishes();
                showMessage('🗑️ Бажання видалено!', 'info');
            }, 600);
        }
    };
    
    window.saveEdit = function() {
        const name = editName.value.trim();
        if (!name) {
            shakeInput(editName);
            showMessage('❌ Назва не може бути порожньою!', 'error');
            return;
        }
        
        const wishIndex = wishes.findIndex(w => w.id === editingWishId);
        if (wishIndex !== -1) {
            wishes[wishIndex] = {
                id: editingWishId,
                name: name,
                link: editLink.value.trim(),
                price: editPrice.value ? parseFloat(editPrice.value) : null
            };
            
            saveWishes();
            renderWishes();
            closeEditModal();
            createConfetti();
            showMessage('💾 Зміни збережено!', 'success');
        }
    };
    
    window.closeEditModal = function() {
        editModal.classList.add('hidden');
        editingWishId = null;
    };
    
    function saveWishes() {
        if (currentUser && users[currentUser]) {
            users[currentUser].wishes = wishes;
            localStorage.setItem('cosmicUsers', JSON.stringify(users));
        }
    }
    
 
    function renderFriends() {
        if (!currentUser) return;
        
        const allUsers = Object.keys(users);
        const myFriends = users[currentUser].friends || [];
        
        friendsContainer.innerHTML = '';
        
        if (allUsers.length <= 1) {
            friendsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🚀</div>
                    <p>Ще немає інших космонавтів!</p>
                </div>
            `;
            return;
        }
        
        const usersList = document.createElement('div');
        usersList.className = 'users-list';
        
        allUsers.forEach(username => {
            if (username === currentUser) return;
            
            const isFriend = myFriends.includes(username);
            const userDiv = document.createElement('div');
            userDiv.className = 'user-item';
            userDiv.innerHTML = `
                <div class="user-info">
                    <span class="user-avatar">🚀</span>
                    <span class="username">${username}</span>
                </div>
                <div class="user-actions">
                    <button class="friend-btn ${isFriend ? 'remove' : 'add'}" onclick="toggleFriend('${username}')">
                        ${isFriend ? '❌ Видалити' : '➕ Додати'}
                    </button>
                    <button class="view-btn" onclick="viewFriendWishes('${username}')">
                        👁️ Бажання
                    </button>
                </div>
            `;
            usersList.appendChild(userDiv);
        });
        
        friendsContainer.appendChild(usersList);
    }
    
    window.toggleFriend = function(friendName) {
        if (!currentUser) return;
        
        const myFriends = users[currentUser].friends || [];
        const friendIndex = myFriends.indexOf(friendName);
        
        if (friendIndex > -1) {
            myFriends.splice(friendIndex, 1);
            showMessage(`❌ ${friendName} видалено з друзів!`, 'info');
        } else {
            myFriends.push(friendName);
            showMessage(`➕ ${friendName} додано в друзі!`, 'success');
            createConfetti();
        }
        
        users[currentUser].friends = myFriends;
        localStorage.setItem('cosmicUsers', JSON.stringify(users));
        renderFriends();
    };
    
    window.viewFriendWishes = function(friendName) {
        const friendWishes = users[friendName].wishes || [];
        
        if (friendWishes.length === 0) {
            showMessage(`🌌 У ${friendName} ще немає бажань!`, 'info');
            return;
        }
        
        let wishesHTML = `<h3>🎁 Бажання ${friendName}:</h3>`;
        friendWishes.forEach(wish => {
            const priceHTML = wish.price ? `<div class="price">${wish.price} грн</div>` : '';
            const linkHTML = wish.link ? `<a class="shop-btn" target="_blank" href="${wish.link}">🛒 Магазин</a>` : '';
            wishesHTML += `
                <div class="friend-wish-item">
                    <h4>${wish.name}</h4>
                    ${priceHTML}
                    ${linkHTML}
                </div>
            `;
        });
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass-modal">
                <div class="modal-header">
                    <h3 class="modal-title">👁️ Бажання друга</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    ${wishesHTML}
                    <button class="cancel-btn" onclick="this.closest('.modal').remove()" style="margin-top: 15px;">Закрити</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    };
    
    
    function renderChatList() {
        if (!currentUser) return;
        
        const myFriends = users[currentUser].friends || [];
        
        if (myFriends.length === 0) {
            chatHeader.innerHTML = '<p>👥 Додай друзів для спілкування!</p>';
            chatMessages.innerHTML = '';
            chatInputGroup.classList.add('hidden');
            return;
        }
        
        chatHeader.innerHTML = `
            <p>💬 Обери друга для чату:</p>
            <select id="friend-select" onchange="selectChatFriend(this.value)">
                <option value="">-- Обери друга --</option>
                ${myFriends.map(friend => `<option value="${friend}">🚀 ${friend}</option>`).join('')}
            </select>
        `;
    }
    
    window.selectChatFriend = function(friendName) {
        currentChatFriend = friendName;
        
        if (!friendName) {
            chatMessages.innerHTML = '';
            chatInputGroup.classList.add('hidden');
            return;
        }
        
        chatInputGroup.classList.remove('hidden');
        loadChatMessages();
    };
    
    function loadChatMessages() {
        if (!currentUser || !currentChatFriend) return;
        
        const messages = users[currentUser].messages[currentChatFriend] || [];
        
        chatMessages.innerHTML = '';
        
        if (messages.length === 0) {
            chatMessages.innerHTML = '<div class="empty-chat">💭 Почни розмову!</div>';
            return;
        }
        
        messages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender === currentUser ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `
                <div class="message-bubble">
                    <div class="message-text">${msg.text}</div>
                    <div class="message-time">${msg.time}</div>
                </div>
            `;
            chatMessages.appendChild(messageDiv);
        });
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    window.sendMessage = function() {
        if (!currentUser || !currentChatFriend) return;
        
        const text = messageInput.value.trim();
        if (!text) return;
        
        const time = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        
      
        if (!users[currentUser].messages[currentChatFriend]) {
            users[currentUser].messages[currentChatFriend] = [];
        }
        users[currentUser].messages[currentChatFriend].push({
            sender: currentUser,
            text: text,
            time: time
        });
        

        if (!users[currentChatFriend].messages[currentUser]) {
            users[currentChatFriend].messages[currentUser] = [];
        }
        users[currentChatFriend].messages[currentUser].push({
            sender: currentUser,
            text: text,
            time: time
        });
        
        localStorage.setItem('cosmicUsers', JSON.stringify(users));
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-text">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    
    function createConfetti() {
        const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#9370DB', '#00FF7F'];
        
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-10px';
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                confetti.style.width = Math.random() * 20 + 10 + 'px';
                confetti.style.height = confetti.style.width;
                confetti.style.animationDelay = Math.random() * 0.3 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                confetti.style.boxShadow = `0 0 10px ${confetti.style.backgroundColor}`;
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 4000);
            }, i * 25);
        }
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    

    loginUsername.addEventListener('keypress', (e) => e.key === 'Enter' && loginUser());
    loginPassword.addEventListener('keypress', (e) => e.key === 'Enter' && loginUser());
    registerUsername.addEventListener('keypress', (e) => e.key === 'Enter' && registerUser());
    registerPassword.addEventListener('keypress', (e) => e.key === 'Enter' && registerUser());
    messageInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
    
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
});
