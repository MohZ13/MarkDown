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
    $('.wrapper').each(function () {
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
 * Opens modal
 * @param {string} fileName Name of the file to be pre-filled
 * @param {boolean} isHtml is for HTML or src string
 */
function openModal(fileName, isHtml) {
    $('#export-file-modal').addClass('is-active');

    const fileNameInput = $('#filename-input');
    fileNameInput.val(fileName);
    fileNameInput.attr('data-target', isHtml ? 'html' : 'src');
}

/**
 * Saves file
 */
function saveFile() {
    const fileName = $('#filename-input').val();

    if (!fileName) {
        return;
    }

    const isHtml = fileNameInput.attr('data-target') === 'html';
    let mimeType, content;
    if (isHtml) {
        mimeType = 'text/html';
        content = $('#markdown-target').contents().find('body').html();
    } else {
        mimeType = 'text/markdown';
        content = $('#markdown-src').val();
    }

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', fileName);
    downloadLink.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(content));
    downloadLink.click();
}

/**
 * Binds click events for file export related buttons
 */
function bindExportLinkClicks() {
    $('#export-src-link').click(() => openModal('untitled.md', false));
    $('#export-target-link').click(() => openModal('untitled.html', true));
    $('#save-file').click(saveFile);
    $('.close-modal-btn').click(() => $('#export-file-modal').removeClass('is-active'));
}

/**
 * Binds filename input change event
 * for showing error and disabling button on empty filename
 */
function bindFileNameChanged() {
    const filenameInput = $('#filename-input');
    const saveFileButton = $('#save-file');

    const isSuccessClass = 'is-success';
    const isDangerClass = 'is-danger';
    const isStaticClass = 'is-static';

    filenameInput.on('input', debounce((event) => {
        if (event.target.value) {
            filenameInput.removeClass(isDangerClass);
            filenameInput.addClass(isSuccessClass);
            saveFileButton.removeClass(isStaticClass);
        } else {
            filenameInput.removeClass(isSuccessClass);
            filenameInput.addClass(isDangerClass)
            saveFileButton.addClass(isStaticClass);
        }
    }, 150));
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
    bindExportLinkClicks();
    bindFileNameChanged();

    // initialization things
    resizeColumns();
    renderMarkdown($('#markdown-src').val());
}

/**
 * Registers service worker for caching files
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js');
        });
    }
}

$(document).ready(onDocumentReady);
registerServiceWorker();
