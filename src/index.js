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
                    {slides[currentSlide].imageUrl ? (
                        <img src={slides[currentSlide].imageUrl} alt={slides[currentSlide].title} />
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
    const { slides, textOnLeft } = attributes;
    const blockProps = useBlockProps.save();

    return (
        <div {...blockProps}>
            <div className={`slider-container ${textOnLeft ? 'text-left' : 'text-right'}`}>
                <div className="slide-content">
                    <div className="slide-content-inner">
                        <RichText.Content tagName="h3" value={slides[0].title} />
                        <RichText.Content tagName="p" value={slides[0].content} />
                    </div>
                </div>
                <div className="slide-images-container">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className={`slide-image ${index === 0 ? 'active' : ''}`}>
                            {slide.imageUrl ? (
                                <img src={slide.imageUrl} alt={slide.title} />
                            ) : (
                                <div className="placeholder-image">Image Placeholder</div>
                            )}
                        </div>
                    ))}
                    <div className="slider-controls">
                        <button type="button" className="slider-button prev">←</button>
                        <span className="slide-counter">1 / {slides.length}</span>
                        <button type="button" className="slider-button next">→</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
