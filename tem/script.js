// Таймер обратного отсчета
function updateTimer() {
    const weddingDate = new Date('June 27, 2026 12:15:00').getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
}

// Обновляем таймер каждую минуту
setInterval(updateTimer, 60000);
updateTimer(); // Запускаем сразу

// Плавная прокрутка для навигации
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// FAQ аккордеон
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = answer.classList.contains('active');
        
        // Закрываем все ответы
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('active');
        });
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
        });
        
        // Если ответ не был активен, открываем его
        if (!isActive) {
            answer.classList.add('active');
            question.classList.add('active');
        }
    });
});

// Обработка формы RSVP
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // В реальном проекте здесь будет отправка на сервер
    // Для демо просто покажем сообщение
    const formMessage = document.getElementById('form-message');
    
    // Симуляция успешной отправки
    formMessage.textContent = `Спасибо, ${data.name}! Ваш ответ успешно отправлен.`;
    formMessage.style.display = 'block';
    formMessage.style.backgroundColor = '#d4edda';
    formMessage.style.color = '#155724';
    formMessage.style.border = '1px solid #c3e6cb';
    
    // Очищаем форму
    this.reset();
    
    // Скрываем сообщение через 5 секунд
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
});

// Подсветка активного раздела при прокрутке
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==== ТЕЛЕГРАМ БОТ ДЛЯ ФОРМЫ RSVP ====

const BOT_TOKEN = '8532356107:AAHEzVAmqFSiombP9RuYG0PSdR1x6Z-veqk';
const CHAT_ID = '1949703968';

// Обработка формы RSVP
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const guests = document.getElementById('guests').value;
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const message = document.getElementById('message').value || 'Не указано';
    
    // Формируем сообщение
    const text = `🎉 НОВОЕ ПОДТВЕРЖДЕНИЕ НА СВАДЬБУ!\n\n` +
                 `👤 Имя: ${name}\n` +
                 `👥 Гостей: ${guests}\n` +
                 `✅ Присутствие: ${attendance === 'yes' ? 'ДА' : 'НЕТ'}\n` +
                 `💬 Пожелания: ${message}\n` +
                 `⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
    
    // Кодируем для URL
    const encodedText = encodeURIComponent(text);
    
    // Отправляем в Telegram
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodedText}`)
        .then(response => {
            if (response.ok) {
                // Успешно - показываем сообщение
                document.getElementById('form-message').innerHTML = `
                    <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 5px;">
                        ✅ <strong>Спасибо, ${name}!</strong><br>
                        Ваш ответ успешно отправлен. Ждём вас на свадьбе!
                    </div>
                `;
                
                // Очищаем форму
                document.getElementById('rsvp-form').reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        })
        .catch(error => {
            document.getElementById('form-message').innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px;">
                    ❌ Ошибка отправки. Пожалуйста, напишите нам напрямую.
                </div>
            `;
        });
});