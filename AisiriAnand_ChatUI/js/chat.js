$(document).ready(function() {
    // DOM Elements
    const $messagesContainer = $('#messagesContainer');
    const $welcomeScreen = $('#welcomeScreen');
    const $messagesArea = $('#messagesArea');
    const $typingIndicator = $('#typingIndicator');
    const $messageInput = $('#messageInput');
    const $sendBtn = $('#sendBtn');
    const $attachBtn = $('#attachBtn');
    const $themeToggle = $('#themeToggle');
    const $exportBtn = $('#exportBtn');
    const $newChatBtn = $('#newChatBtn');
    const $menuToggle = $('#menuToggle');
    const $sidebar = $('#sidebar');
    const $mobileOverlay = $('#mobileOverlay');
    
    // State
    let isFirstMessage = true;
    let isTyping = false;
    
    // Mock AI Responses
    const aiResponses = [
        "I'd be happy to help you with that! Let me think through this step by step.",
        "That's a great question! Here's what I can tell you about it...",
        "I understand what you're looking for. Let me provide you with some guidance.",
        "Based on what you've shared, I think the best approach would be...",
        "That's an interesting problem! Let me break it down for you.",
        "I can definitely assist with that. Here's my recommendation...",
        "Thanks for asking! Here's how you can tackle this challenge...",
        "Great question! Let me explain this concept clearly for you.",
        "I see what you mean. Here's a solution that should work well...",
        "Absolutely! Let me walk you through the process step by step."
    ];
    
    // Initialize
    function init() {
        setupEventListeners();
        checkTheme();
        autoResizeTextarea();
    }
    
    // Event Listeners Setup
    function setupEventListeners() {
        // Message Input Events
        $messageInput.on('input', handleInputChange);
        $messageInput.on('keydown', handleKeyPress);
        
        // Button Events
        $sendBtn.on('click', sendMessage);
        $attachBtn.on('click', handleAttachment);
        $themeToggle.on('click', toggleTheme);
        $exportBtn.on('click', exportChat);
        $newChatBtn.on('click', startNewChat);
        
        // Mobile Menu Events
        $menuToggle.on('click', toggleSidebar);
        $mobileOverlay.on('click', closeSidebar);
        
        // Suggestion Cards Events
        $('.suggestion-card').on('click', handleSuggestionCard);
        
        // Chat History Events
        $('.chat-item').on('click', handleChatHistory);
        
        // Window Events
        $(window).on('resize', handleResize);
    }
    
    // Handle Input Change
    function handleInputChange() {
        const message = $messageInput.val().trim();
        $sendBtn.prop('disabled', message.length === 0);
        autoResizeTextarea();
    }
    
    // Handle Key Press
    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }
    
    // Send Message
    function sendMessage() {
        const message = $messageInput.val().trim();
        
        if (message.length === 0 || isTyping) return;
        
        // Hide welcome screen on first message
        if (isFirstMessage) {
            $welcomeScreen.fadeOut(300, function() {
                $messagesArea.fadeIn(300);
            });
            isFirstMessage = false;
        }
        
        // Add user message
        addMessage(message, 'user');
        
        // Clear input and disable send button
        $messageInput.val('');
        $sendBtn.prop('disabled', true);
        autoResizeTextarea();
        
        // Show typing indicator and simulate AI response
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            addMessage(randomResponse, 'ai');
        }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
    }
    
    // Add Message to Chat
    function addMessage(text, sender) {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const senderName = sender === 'user' ? 'You' : 'AI Assistant';
        const senderIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
        
        const messageHTML = `
            <div class="message ${sender}">
                <div class="message-avatar">
                    <i class="fas ${senderIcon}"></i>
                </div>
                <div class="message-content">
                    <div class="message-header">
                        <span>${senderName}</span>
                        <span class="message-time">${timestamp}</span>
                    </div>
                    <div class="message-body">
                        ${text}
                    </div>
                </div>
            </div>
        `;
        
        $messagesArea.append(messageHTML);
        scrollToBottom();
    }
    
    // Show Typing Indicator
    function showTypingIndicator() {
        isTyping = true;
        $typingIndicator.fadeIn(300);
        scrollToBottom();
    }
    
    // Hide Typing Indicator
    function hideTypingIndicator() {
        isTyping = false;
        $typingIndicator.fadeOut(300);
    }
    
    // Scroll to Bottom
    function scrollToBottom() {
        $messagesContainer.animate({
            scrollTop: $messagesContainer[0].scrollHeight
        }, 300);
    }
    
    // Auto Resize Textarea
    function autoResizeTextarea() {
        $messageInput.css('height', 'auto');
        $messageInput.css('height', Math.min($messageInput[0].scrollHeight, 120) + 'px');
    }
    
    // Handle Attachment
    function handleAttachment() {
        // Create a temporary file input
        const $fileInput = $('<input type="file" style="display: none;">');
        $('body').append($fileInput);
        
        $fileInput.on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                addMessage(`Attached file: ${file.name}`, 'user');
                $fileInput.remove();
            }
        });
        
        $fileInput.click();
    }
    
    // Toggle Theme
    function toggleTheme() {
        const currentTheme = $('html').attr('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        $('html').attr('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = newTheme === 'dark' ? 'fa-sun' : 'fa-moon';
        $themeToggle.html(`<i class="fas ${icon}"></i>`);
    }
    
    // Check Theme
    function checkTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        $('html').attr('data-theme', savedTheme);
        
        // Update icon
        const icon = savedTheme === 'dark' ? 'fa-sun' : 'fa-moon';
        $themeToggle.html(`<i class="fas ${icon}"></i>`);
    }
    
    // Export Chat
    function exportChat() {
        const messages = [];
        $messagesArea.find('.message').each(function() {
            const $message = $(this);
            const sender = $message.hasClass('user') ? 'You' : 'AI Assistant';
            const text = $message.find('.message-body').text().trim();
            const time = $message.find('.message-time').text();
            
            messages.push(`[${time}] ${sender}: ${text}`);
        });
        
        if (messages.length === 0) {
            alert('No messages to export!');
            return;
        }
        
        const chatText = messages.join('\n\n');
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const $a = $('<a></a>')
            .attr('href', url)
            .attr('download', `chat-export-${new Date().toISOString().slice(0, 10)}.txt`)
            .css('display', 'none');
        
        $('body').append($a);
        $a[0].click();
        $a.remove();
        URL.revokeObjectURL(url);
    }
    
    // Start New Chat
    function startNewChat() {
        $messagesArea.empty();
        $welcomeScreen.fadeIn(300);
        $messagesArea.fadeOut(300);
        isFirstMessage = true;
        scrollToTop();
    }
    
    // Handle Suggestion Card Click
    function handleSuggestionCard() {
        const suggestion = $(this).data('suggestion');
        $messageInput.val(suggestion);
        handleInputChange();
        sendMessage();
    }
    
    // Handle Chat History Click
    function handleChatHistory() {
        // Remove active class from all items
        $('.chat-item').removeClass('active');
        
        // Add active class to clicked item
        $(this).addClass('active');
        
        // Load chat history (mock implementation)
        const chatTitle = $(this).find('span').text();
        startNewChat();
        
        // Add some mock messages for demonstration
        setTimeout(() => {
            addMessage(`Loading chat: ${chatTitle}`, 'ai');
            addMessage('This is a previous conversation. How can I help you continue?', 'ai');
        }, 500);
    }
    
    // Toggle Sidebar (Mobile)
    function toggleSidebar() {
        $sidebar.toggleClass('active');
        $mobileOverlay.toggleClass('active');
    }
    
    // Close Sidebar (Mobile)
    function closeSidebar() {
        $sidebar.removeClass('active');
        $mobileOverlay.removeClass('active');
    }
    
    // Handle Window Resize
    function handleResize() {
        if ($(window).width() > 992) {
            closeSidebar();
        }
    }
    
    // Scroll to Top
    function scrollToTop() {
        $messagesContainer.scrollTop(0);
    }
    
    // Initialize the app
    init();
});

// Utility Functions
function formatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard Shortcuts
$(document).ready(function() {
    // Ctrl/Cmd + K for new chat
    $(document).on('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('#newChatBtn').click();
        }
        
        // Ctrl/Cmd + D for dark mode toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            $('#themeToggle').click();
        }
        
        // Ctrl/Cmd + E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            $('#exportBtn').click();
        }
        
        // Escape to close sidebar on mobile
        if (e.key === 'Escape' && $(window).width() <= 992) {
            closeSidebar();
        }
    });
});
