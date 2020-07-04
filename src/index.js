// style imports
import './styles.scss';

// library imports
import $ from 'jquery';
import marked from 'marked';

/**
 * Binds navbar burger's click event for menu on mobile devices 
 */
function bindNavbarBurgerClickEvent() {
    $('.navbar-burger').click(function () {
        // Toggle the 'is-active' class on both the 'navbar-burger' and the 'navbar-menu'
        $('.navbar-burger').toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });
}

/**
 * Binds click events for layout switch between editor and preview
 * for mobile devices
 */
function bindLayoutSwitchEvent() {
    const editorColumn = $('#editor-column');
    const previewColumn = $('#preview-column');
    const editorSwitchButton = $('#layout-editor-switch');
    const previewSwitchButton = $('#layout-preview-switch');

    const isHiddenClass = 'is-hidden';
    const isHiddenTouchClass = 'is-hidden-touch';

    const handleLayoutSwitch = () => {
        const isEditorSwitchHidden = editorSwitchButton.hasClass(isHiddenClass);
        if (isEditorSwitchHidden) {
            editorSwitchButton.removeClass(isHiddenClass);
            previewSwitchButton.addClass(isHiddenClass);

            editorColumn.addClass(isHiddenTouchClass);
            previewColumn.removeClass(isHiddenTouchClass);
        } else {
            previewSwitchButton.removeClass(isHiddenClass);
            editorSwitchButton.addClass(isHiddenClass);

            previewColumn.addClass(isHiddenTouchClass);
            editorColumn.removeClass(isHiddenTouchClass);
        }
        resizeColumns();
    }
    $(previewSwitchButton).click(handleLayoutSwitch);
    $(editorSwitchButton).click(handleLayoutSwitch);
}

/**
 * Resizes column heights for editor and preview
 */
function resizeColumns() {
    $('.field').each(function () {
        $(this).height(window.innerHeight - this.offsetTop - 50);
    });
}

/**
 * Helper function to debounce function calls
 * @param {Function} fn function to be debounced
 * @param {number} delay delay after which function to be called
 */
function debounce(fn, delay) {
    let debounceTimer;
    return function () {
        clearTimeout(debounceTimer);
        const context = this, args = arguments;
        debounceTimer = setTimeout(() => fn.apply(context, args), delay);
    };
}

/**
 * Renders markdown in target iframe
 * @param {string} markdownSrcString markdown string to be parsed and rendered
 */
function renderMarkdown(markdownSrcString) {
    const markdownTarget = $('#markdown-target').contents().find('body');
    markdownTarget.html(marked(markdownSrcString));
}

/**
 * Binds input event to src textarea for listening to changes
 * and rendering markdown
 */
function bindMarkdownSrcChange() {
    $('#markdown-src').on('input', debounce((event) => renderMarkdown(event.target.value), 250));
}

/**
 * Initializations to be done after document is ready
 */
function onDocumentReady() {
    // bind event listeners
    $(window).resize(debounce(resizeColumns, 250));
    bindMarkdownSrcChange();
    bindNavbarBurgerClickEvent();
    bindLayoutSwitchEvent();

    // initialization things
    resizeColumns();
    renderMarkdown($('#markdown-src').val());
}

$(document).ready(onDocumentReady);
