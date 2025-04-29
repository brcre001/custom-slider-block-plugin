document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.wp-block-ctsb-text-image-slider');
    
    sliders.forEach(slider => {
        const slideImages = slider.querySelectorAll('.slide-image');
        const prevButton = slider.querySelector('.slider-button.prev');
        const nextButton = slider.querySelector('.slider-button.next');
        const counter = slider.querySelector('.slide-counter');
        let currentSlide = 0;

        // Update counter
        const updateCounter = () => {
            if (counter) {
                counter.textContent = `${currentSlide + 1} / ${slideImages.length}`;
            }
        };

        // Show slide
        const showSlide = (index) => {
            slideImages.forEach(slide => {
                slide.classList.remove('active');
                slide.style.display = 'none';
            });
            slideImages[index].classList.add('active');
            slideImages[index].style.display = 'flex';
            currentSlide = index;
            updateCounter();
        };

        // Event listeners
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                const newIndex = currentSlide > 0 ? currentSlide - 1 : slideImages.length - 1;
                showSlide(newIndex);
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                const newIndex = currentSlide < slideImages.length - 1 ? currentSlide + 1 : 0;
                showSlide(newIndex);
            });
        }

        // Initialize
        if (slideImages.length > 0) {
            showSlide(0);
        }
    });
}); 