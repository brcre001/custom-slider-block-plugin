import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Button, TextControl, MediaUpload, MediaUploadCheck } from '@wordpress/components';
import { useState } from '@wordpress/element';

// Import styles
import './style.css';
import './editor.css';

// Register the block
registerBlockType('ctsb/text-image-slider', {
    edit: Edit,
    save: () => null, // Dynamic block, no save function needed
});

function Edit({ attributes, setAttributes }) {
    const { slides, textOnLeft } = attributes;
    const [currentSlide, setCurrentSlide] = useState(0);

    const updateSlide = (index, field, value) => {
        const newSlides = [...slides];
        newSlides[index][field] = value;
        setAttributes({ slides: newSlides });
    };

    const addSlide = () => {
        setAttributes({ slides: [...slides, { text: '', image: '' }] });
    };

    const removeSlide = (index) => {
        const newSlides = slides.filter((_, i) => i !== index);
        setAttributes({ slides: newSlides });
    };

    const blockProps = useBlockProps();

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings" initialOpen={true}>
                    <ToggleControl
                        label="Text on Left"
                        checked={textOnLeft}
                        onChange={(value) => setAttributes({ textOnLeft: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className={`slider-container ${textOnLeft ? 'text-left' : 'text-right'}`}>
                    <div className="slide-content">
                        {slides.length > 0 && (
                            <>
                                <div>{slides[currentSlide]?.text}</div>
                                <div className="slider-controls">
                                    <Button
                                        className="slider-button"
                                        onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
                                    >
                                        ←
                                    </Button>
                                    <Button
                                        className="slider-button"
                                        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
                                    >
                                        →
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="slide-image">
                        {slides.length > 0 && slides[currentSlide]?.image && (
                            <img src={slides[currentSlide]?.image} alt="" />
                        )}
                    </div>
                </div>

                <div className="slide-editor">
                    {slides.map((slide, index) => (
                        <div key={index} className="slide">
                            <TextControl
                                label={`Slide ${index + 1} Text`}
                                value={slide.text}
                                onChange={(value) => updateSlide(index, 'text', value)}
                            />
                            <MediaUploadCheck>
                                <MediaUpload
                                    onSelect={(media) => updateSlide(index, 'image', media.url)}
                                    allowedTypes={['image']}
                                    value={slide.image}
                                    render={({ open }) => (
                                        <Button onClick={open} isSecondary>
                                            {slide.image ? 'Change Image' : 'Select Image'}
                                        </Button>
                                    )}
                                />
                            </MediaUploadCheck>
                            <Button
                                isDestructive
                                onClick={() => removeSlide(index)}
                            >
                                Remove Slide
                            </Button>
                        </div>
                    ))}
                    <Button onClick={addSlide} variant="primary" style={{ marginTop: '20px' }}>
                        Add Slide
                    </Button>
                </div>
            </div>
        </>
    );
}
