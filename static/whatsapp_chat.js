
document.addEventListener('DOMContentLoaded', function() {
    const chatBubble = document.getElementById('whatsappChatBubble');
    const chatPopup = document.getElementById('whatsappChatPopup');
    const closePopupBtn = document.getElementById('closeWhatsappPopup');

    if (chatBubble && chatPopup && closePopupBtn) {
        chatBubble.addEventListener('click', function() {
            chatPopup.classList.toggle('active');
        });

        closePopupBtn.addEventListener('click', function() {
            chatPopup.classList.remove('active');
        });

        // Close popup if clicked outside
        document.addEventListener('click', function(event) {
            if (!chatPopup.contains(event.target) && !chatBubble.contains(event.target) && chatPopup.classList.contains('active')) {
                chatPopup.classList.remove('active');
            }
        });
    }
});