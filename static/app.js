class Chatbox {
    constructor() {
        this.args = {
            chatBox: document.querySelector('.chatbox'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { chatBox, sendButton } = this.args;

        // Check if elements exist
        if (!chatBox || !sendButton) {
            console.error("One or more elements are not found.");
            return;
        }

        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const inputField = chatBox.querySelector('input');
        if (inputField) {
            inputField.addEventListener("keyup", ({ key }) => {
                if (key === "Enter") {
                    this.onSendButton(chatBox);
                }
            });
        } else {
            console.error("Input field not found.");
        }
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // Show or hide the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        fetch('https://wesbite-rekindle.vercel.app/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            let msg2 = { name: "Sam", message: data.answer };
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            textField.value = '';
        })
        .catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox);
            textField.value = '';
        });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.forEach(function(item) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatMessageContainer = chatbox.querySelector('.chatbox__messages');
        if (chatMessageContainer) {
            chatMessageContainer.innerHTML = html;

            // Scroll to the bottom
            chatMessageContainer.scrollTop = chatMessageContainer.scrollHeight;
        } else {
            console.error('Chat messages container not found.');
        }
    }
}

// Ensure the DOM is loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const chatbox = new Chatbox();
    chatbox.display();
});
