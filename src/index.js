import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, RichText, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Import styles
import './style.css';
import './editor.css';

// Register the block
registerBlockType('ctsb/text-image-slider', {
    edit: Edit,
    save: Save,
    attributes: {
        title: {
            type: 'string',
            default: 'Text & Image Slider'
        },
        description: {
            type: 'string',
            default: 'A slider with text and images.'
        },
        slides: {
            type: 'array',
            default: [
                {
                    id: 1,
                    imageUrl: ''
                }
            ]
        },
        textOnLeft: {
            type: 'boolean',
            default: true
        }
    }
});

function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();
    const { slides = [], textOnLeft = true } = attributes;
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Debug logs
    console.log('Attributes:', attributes);
    console.log('Slides:', slides);
    console.log('Current Slide:', currentSlide);
    console.log('Current Slide Data:', slides[currentSlide]);
    
    const addSlide = () => {
        const newSlide = {
            id: slides.length + 1,
            imageUrl: ''
        };
        setAttributes({ slides: [...slides, newSlide] });
    };

    const updateSlide = (index, field, value) => {
        const updatedSlides = [...slides];
        updatedSlides[index] = { ...updatedSlides[index], [field]: value };
        setAttributes({ slides: updatedSlides });
    };

    const updateText = (field, value) => {
        setAttributes({ [field]: value });
    };

    const removeSlide = (index) => {
        if (slides.length > 1) {
            const updatedSlides = slides.filter((_, i) => i !== index);
            setAttributes({ slides: updatedSlides });
            setCurrentSlide(Math.min(currentSlide, updatedSlides.length - 1));
        }
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title="Settings" initialOpen={true}>
                    <ToggleControl
                        label="Text on Left"
                        checked={textOnLeft}
                        onChange={(value) => setAttributes({ textOnLeft: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div className={`slider-container ${textOnLeft ? 'text-left' : 'text-right'}`}>
                <div className="slide-content">
                    <div className="slide-content-inner">
                        <RichText
                            tagName="h3"
                            value={attributes.title}
                            onChange={(value) => updateText('title', value)}
                            placeholder="Enter title"
                        />
                        <RichText
                            tagName="p"
                            value={attributes.description}
                            onChange={(value) => updateText('description', value)}
                            placeholder="Enter description"
                        />
                    </div>
                </div>
                <div className="slide-image">
                    {slides && slides.length > 0 && slides[currentSlide] && slides[currentSlide].imageUrl ? (
                        <div className="image-container">
                            <img src={slides[currentSlide].imageUrl} alt={attributes.title} />
                            <Button 
                                className="delete-image-button"
                                onClick={() => updateSlide(currentSlide, 'imageUrl', '')}
                                isDestructive
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#FFFFFF">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                            </Button>
                        </div>
                    ) : (
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={(media) => updateSlide(currentSlide, 'imageUrl', media.url)}
                                allowedTypes={['image']}
                                render={({open}) => (
                                    <Button onClick={open} className="placeholder-image">
                                        Upload Image
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>
                    )}
                </div>
            </div>
            
            <div className="slider-controls">
                <Button 
                    className="slider-button"
                    onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                    disabled={currentSlide === 0}
                >
                    ←
                </Button>
                <span className="slide-counter">
                    {currentSlide + 1} / {slides.length}
                </span>
                <Button 
                    className="slider-button"
                    onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                    disabled={currentSlide === slides.length - 1}
                >
                    →
                </Button>
            </div>

            <div className="slide-editor">
                <Button 
                    onClick={addSlide} 
                    variant="primary" 
                    style={{ marginRight: '10px' }}
                >
                    Add Slide
                </Button>
                <Button 
                    onClick={() => removeSlide(currentSlide)}
                    variant="secondary"
                    isDestructive
                >
                    Remove Current Slide
                </Button>
            </div>
        </div>
    );
}

function Save({ attributes }) {
    const { slides, textOnLeft, title, description } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            <div className={`slider-container ${textOnLeft ? 'text-left' : 'text-right'}`}>
                <div className="slide-content">
                    <div className="slide-content-inner">
                        <RichText.Content tagName="h3" value={title} />
                        <RichText.Content tagName="p" value={description} />
                    </div>
                </div>
                <div className="slide-images-container">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className={`slide-image ${index === 0 ? 'active' : ''}`}>
                            {slide.imageUrl ? (
                                <img src={slide.imageUrl} alt={title} />
                            ) : (
                                <div className="placeholder-image">Image Placeholder</div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="slider-controls">
                    <button type="button" className="slider-button prev">←</button>
                    <span className="slide-counter">1 / {slides.length}</span>
                    <button type="button" className="slider-button next">→</button>
                </div>
            </div>
        </div>
    );
}
