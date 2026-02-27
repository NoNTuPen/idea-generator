// logic.js

// ============== ИНИЦИАЛИЗАЦИЯ ДАННЫХ ==============
let ideas = JSON.parse(localStorage.getItem('ideas') || '[]');
let usedIdeas = JSON.parse(localStorage.getItem('usedIdeas') || '[]');

// ============== DOM ЭЛЕМЕНТЫ ==============
const ideaCountSpan = document.getElementById('idea_count');
const activeIdeasList = document.getElementById('active-ideas-list');
const usedIdeasList = document.getElementById('used-ideas-list');
const generatedIdeaSpan = document.querySelector('.generated-idea');

const addIdeaContainer = document.getElementById('add_idea_container');
const allIdeasContainer = document.getElementById('all_ideas_list_container');
const generateIdeaContainer = document.getElementById('generate_idea_container');

const addIdeaBtn = document.getElementById('add_idea_button');
const allIdeasBtn = document.getElementById('all_ideas_list_button');
const generateIdeaBtn = document.getElementById('generate_idea_button');

const addIdeaConfirmBtn = document.getElementById('add_idea_button_conf');
const generateIdeaConfirmBtn = document.getElementById('generate_idea_button_conf');

const ideaInput = document.getElementById('idea_input');
const exceptionSpan = document.querySelector('.exeption');

// ============== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==============

function saveToStorage() {
    localStorage.setItem('ideas', JSON.stringify(ideas));
    localStorage.setItem('usedIdeas', JSON.stringify(usedIdeas));
}

function updateIdeaCount() {
    if (ideaCountSpan) {
        ideaCountSpan.textContent = ideas.length;
    }
}

function clearInput() {
    if (ideaInput) {
        ideaInput.value = '';
        ideaInput.style.height = 'auto';
    }
    if (exceptionSpan) {
        exceptionSpan.style.display = 'none';
    }
}

function showError(message) {
    if (exceptionSpan) {
        exceptionSpan.textContent = message || '*ошибка заполнения';
        exceptionSpan.style.display = 'block';
    }
}

function setupAutoResize() {
    if (ideaInput) {
        ideaInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            if (exceptionSpan) exceptionSpan.style.display = 'none';
        });
    }
}

// ============== НАВИГАЦИЯ ==============

function showSection(sectionToShow) {
    addIdeaContainer.classList.remove('active');
    allIdeasContainer.classList.remove('active');
    generateIdeaContainer.classList.remove('active');
    if (sectionToShow) sectionToShow.classList.add('active');
}

if (addIdeaBtn) {
    addIdeaBtn.addEventListener('click', () => {
        showSection(addIdeaContainer);
        clearInput();
    });
}

if (allIdeasBtn) {
    allIdeasBtn.addEventListener('click', () => {
        showSection(allIdeasContainer);
        renderAllLists();
    });
}

if (generateIdeaBtn) {
    generateIdeaBtn.addEventListener('click', () => {
        showSection(generateIdeaContainer);
        if (generatedIdeaSpan) generatedIdeaSpan.innerHTML = '';
        if (generateIdeaConfirmBtn) {
            generateIdeaConfirmBtn.textContent = ideas.length > 0 ? 'Получить случайную' : 'Нет идей';
        }
    });
}

// ============== ОТОБРАЖЕНИЕ СПИСКОВ ==============

// Рендер активных идей
function renderActiveIdeas() {
    if (!activeIdeasList) return;
    
    if (ideas.length === 0) {
        activeIdeasList.innerHTML = '<li style="list-style: none; text-align: center; color: #999; padding: 20px;">Нет активных идей</li>';
        return;
    }
    
    const sorted = [...ideas].sort((a, b) => b.id - a.id);
    
    activeIdeasList.innerHTML = sorted.map(idea => `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <span style="flex: 1;">${idea.text}</span>
            <span style="font-size: 14px; color: #999; margin-right: 10px;">${idea.created}</span>
            <button onclick="deleteIdea(${idea.id})" class="delete-btn">&times;</button>
        </li>
    `).join('');
}

// Рендер использованных идей
function renderUsedIdeas() {
    if (!usedIdeasList) return;
    
    if (usedIdeas.length === 0) {
        usedIdeasList.innerHTML = '<li style="list-style: none; text-align: center; color: #999; padding: 20px;">Нет использованных идей</li>';
        return;
    }
    
    const sorted = [...usedIdeas].sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));
    
    usedIdeasList.innerHTML = sorted.map(idea => `
        <li style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; background-color: #f9f9f9;">
            <span style="flex: 1;">${idea.text}</span>
            <span style="font-size: 14px; color: #999; margin-right: 10px;" title="Использовано: ${idea.usedAt}">${idea.usedAt}</span>
            <div class="action-buttons">
                <button onclick="restoreIdea(${idea.id})" class="restore-btn" title="Восстановить">↻</button>
                <button onclick="deleteUsedIdea(${idea.id})" class="delete-btn" title="Удалить">&times;</button>
            </div>
        </li>
    `).join('');
}

function renderAllLists() {
    renderActiveIdeas();
    renderUsedIdeas();
}

// ============== ДОБАВЛЕНИЕ ИДЕИ ==============

function addNewIdea() {
    if (!ideaInput) return;
    const text = ideaInput.value.trim();
    if (!text) {
        showError('*идея не может быть пустой');
        return;
    }
    
    ideas.push({
        id: Date.now(),
        text: text,
        created: new Date().toLocaleString('ru-RU')
    });
    
    saveToStorage();
    updateIdeaCount();
    clearInput();
    
    if (allIdeasContainer.classList.contains('active')) {
        renderAllLists();
    }
    
    alert('Идея добавлена!');
}

if (addIdeaConfirmBtn) {
    addIdeaConfirmBtn.addEventListener('click', addNewIdea);
}

if (ideaInput) {
    ideaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNewIdea();
        }
    });
}

// ============== УДАЛЕНИЕ ИДЕЙ ==============

window.deleteIdea = function(id) {
    if (confirm('Удалить эту идею?')) {
        ideas = ideas.filter(idea => idea.id !== id);
        saveToStorage();
        updateIdeaCount();
        renderActiveIdeas();
        if (generateIdeaConfirmBtn) {
            generateIdeaConfirmBtn.textContent = ideas.length > 0 ? 'Получить случайную' : 'Нет идей';
        }
    }
};

window.deleteUsedIdea = function(id) {
    if (confirm('Удалить эту идею из использованных?')) {
        usedIdeas = usedIdeas.filter(idea => idea.id !== id);
        saveToStorage();
        renderUsedIdeas();
    }
};

// ============== ВОССТАНОВЛЕНИЕ ИДЕИ ==============

window.restoreIdea = function(id) {
    const index = usedIdeas.findIndex(idea => idea.id === id);
    if (index !== -1) {
        const idea = usedIdeas[index];
        usedIdeas.splice(index, 1);
        // Убираем поле usedAt, чтобы оно не мешалось в активных
        const restoredIdea = { ...idea };
        delete restoredIdea.usedAt;
        ideas.push(restoredIdea);
        
        saveToStorage();
        updateIdeaCount();
        renderAllLists();
        
        if (generateIdeaConfirmBtn) {
            generateIdeaConfirmBtn.textContent = ideas.length > 0 ? 'Получить случайную' : 'Нет идей';
        }
        
        alert('Идея восстановлена!');
    }
};

// ============== ГЕНЕРАЦИЯ СЛУЧАЙНОЙ ИДЕИ ==============

function getRandomIdea() {
    if (ideas.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * ideas.length);
    return ideas[randomIndex];
}

function showRandomIdea() {
    if (!generatedIdeaSpan) return;
    const randomIdea = getRandomIdea();
    
    if (!randomIdea) {
        generatedIdeaSpan.innerHTML = 'Нет активных идей';
        return;
    }
    
    generatedIdeaSpan.innerHTML = `
  <div style="text-align: center;">
    <p style="font-size: 18px; margin-bottom: 8px;">${randomIdea.text}</p>
    <button onclick="moveToUsed(${randomIdea.id})" class="use-button">Использовать</button>
  </div>
`;
}

if (generateIdeaConfirmBtn) {
    generateIdeaConfirmBtn.addEventListener('click', showRandomIdea);
}

// ============== ПЕРЕМЕЩЕНИЕ В ИСПОЛЬЗОВАННЫЕ ==============

window.moveToUsed = function(id) {
    const ideaIndex = ideas.findIndex(idea => idea.id === id);
    if (ideaIndex !== -1) {
        const idea = ideas[ideaIndex];
        ideas.splice(ideaIndex, 1);
        
        usedIdeas.push({
            ...idea,
            usedAt: new Date().toLocaleString('ru-RU')
        });
        
        saveToStorage();
        updateIdeaCount();
        
        alert('Идея перемещена в использованные!');
        
        if (allIdeasContainer.classList.contains('active')) {
            renderAllLists();
        }
        
        if (generateIdeaContainer.classList.contains('active')) {
            if (generatedIdeaSpan) generatedIdeaSpan.innerHTML = '🎯 Идея использована';
            if (generateIdeaConfirmBtn) {
                generateIdeaConfirmBtn.textContent = ideas.length > 0 ? 'Получить случайную' : 'Нет идей';
            }
        }
    }
};

// ============== ИНИЦИАЛИЗАЦИЯ ==============

function init() {
    updateIdeaCount();
    setupAutoResize();
    
    if (generateIdeaConfirmBtn) {
        generateIdeaConfirmBtn.textContent = ideas.length > 0 ? 'Получить случайную' : 'Нет идей';
    }
    
    if (exceptionSpan) {
        exceptionSpan.style.display = 'none';
    }
    
    console.log('Приложение готово! Активных:', ideas.length, 'Использованных:', usedIdeas.length);
}

document.addEventListener('DOMContentLoaded', init);
