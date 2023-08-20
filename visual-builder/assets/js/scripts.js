var $content;
var $builder;
var iframe;
var inlineEditors = [];
let preventEdit = false;
var edited_item = false;
let historyAllow = true;

var MfnVbApp = (function($){

let new_widget_wrap, new_widget_wrap_size, new_widget_section, new_widget_wcount, new_widget_container, new_widget_position = 'after';
let $editpanel = $(document);
let screen = 'desktop';
let prebuiltType = 'end';
let context_el;
let mfncopy = false;
let sample_img = mfnvbvars.themepath+'/muffin-options/svg/placeholders/image.svg';
let sample_icon = 'icon-lamp';
let dragging_new = 0;
let historyIndex = 0;
let mfnbuilder = localStorage.getItem('mfn-builder') ? JSON.parse(localStorage.getItem('mfn-builder')) : {};
let scroll_top;
let formaction = $('.btn-save-form-primary').attr('data-action');
let savebutton = $('.btn-save-form-primary span').text();
let previewTab;
let pageid = mfnvbvars.pageid;
let wpnonce = mfnvbvars.wpnonce;
var builder_type = mfnvbvars.builder_type;
let $edited_div = false;
let inlineIndex = 0;
let $navigator = $('.mfn-navigator');
let winH = $(window).height();
let item_name = false;
let wyswig_active = false;
var elements_ver = 'default';
let $undo = $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-undo');
let $redo = $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-redo');

localStorage.setItem('mfnhistory', []);

// new elements objects
var elements = {
    wrap: function(size) {
        var uid = getUid();

        var size_class = size;

        if( size != 'divider' ) size_class = sizes.filter(s => s.key === size)[0];

        var new_wrap = {};
        new_wrap = JSON.parse( JSON.stringify(mfnvbvars.elements.wrap) );

        new_wrap['title'] = 'Wrap';

        if( builder_type == 'header' ){
            // header presets
            new_wrap.attr['style:.mcb-section .mcb-wrap-mfnuidelement:flex-grow'] = '1';
            new_wrap.attr['style:.mcb-section .mcb-wrap-mfnuidelement:flex-grow_tablet'] = '1';
            new_wrap.attr['style:.mcb-section .mcb-wrap-mfnuidelement:flex-grow_mobile'] = '1';

            new_wrap.attr['style:.mcb-section .mcb-wrap-mfnuidelement .mcb-wrap-inner:align-items'] = 'center';
            new_wrap.attr['style:.mcb-section .mcb-wrap-mfnuidelement .mcb-wrap-inner:align-items_tablet'] = 'center';
            new_wrap.attr['style:.mcb-section .mcb-wrap-mfnuidelement .mcb-wrap-inner:align-items_mobile'] = 'center';

            new_wrap['title'] = 'Container';
        }

        new_wrap.uid = uid;
        new_wrap.size = size;
        new_wrap.tablet_size = size;
        new_wrap.tablet_resized = "0";
        new_wrap.mobile_size = '1/1';
        new_wrap.attr.sticky = "0";
        new_wrap.attr.tablet_sticky = "0";
        new_wrap.attr.mobile_sticky = "0";

        mfnvbvars.pagedata.push(new_wrap);

        var answer = {};
        if( size == 'divider' ){
            answer.html = '<div data-uid="'+uid+'" class="blink wrap mcb-wrap vb-item vb-item-wrap mcb-wrap-'+uid+' divider clearfix"><div class="mcb-wrap-inner mcb-wrap-inner-'+uid+'"><div class="wrap-header mfn-header mfn-header-grey"><a class="mfn-option-btn mfn-option-grey mfn-element-drag mfn-wrap-drag" title="Drag & Drop" data-tooltip="Drag" href="#"><span class="mfn-icon mfn-icon-drag"></span></a><a class="mfn-option-btn mfn-option-grey mfn-module-clone mfn-wrap-clone" title="Clone" data-tooltip="Clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a> <a class="mfn-option-btn mfn-option-grey mfn-element-delete" data-tooltip="Delete" title="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a> </div></div></div>';
        }else{
            answer.html = '<div data-uid="'+uid+'" data-desktop-size="'+size+'" data-tablet-size="'+size+'" data-mobile-size="1/1" class="blink wrap mcb-wrap mcb-wrap-new '+ ( builder_type == 'header' ? "mcb-header-wrap" : "" ) +' vb-item vb-item-wrap mcb-wrap-'+uid+' '+size_class.desktop+' '+size_class.tablet+' mobile-one clearfix"><div class="mcb-wrap-inner mcb-wrap-inner-'+uid+' empty"><div class="mfn-drag-helper placeholder-wrap"></div><a href="#" class="btn-item-add mfn-item-add mfn-icon-add-light mfn-wrap-add-item" data-tooltip="Add element">Add element</a><div class="wrap-header mfn-header mfn-header-grey"><a class="mfn-option-btn mfn-option-blue mfn-element-menu mfn-element-edit" href="#" data-tooltip="Edit wrap" data-position="right"><span class="mfn-icon mfn-icon-wrap"></span></a><a class="mfn-option-btn mfn-option-grey mfn-size-change mfn-size-decrease" title="Decrease" data-tooltip="Decrease" href="#"><span class="mfn-icon mfn-icon-dec"></span></a> <a class="mfn-option-btn mfn-option-grey mfn-size-change mfn-size-increase" title="Increase" data-tooltip="Increase" href="#"><span class="mfn-icon mfn-icon-inc"></span></a> <a class="mfn-option-btn mfn-option-text mfn-option-grey mfn-wrap-sort-handler mfn-size-label" title="Size" data-tooltip="Size"><span class="text mfn-element-size-label">'+size+'</span></a> <a class="mfn-option-btn mfn-option-text btn-icon-left mfn-option-grey mfn-item-add" title="Add element" data-tooltip="Add element" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">Element</span></a><a class="mfn-option-btn mfn-option-grey mfn-element-drag mfn-wrap-drag" title="Drag & Drop" data-tooltip="Drag" href="#"><span class="mfn-icon mfn-icon-drag"></span></a><a class="mfn-option-btn mfn-option-grey mfn-element-edit" title="Edit" data-tooltip="Edit" href="#"><span class="mfn-icon mfn-icon-edit"></span></a><a class="mfn-option-btn mfn-option-grey mfn-module-clone mfn-wrap-clone" title="Clone" data-tooltip="Clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a> <a class="mfn-option-btn mfn-option-grey mfn-element-delete" data-tooltip="Delete" title="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a> </div><div class="mfn-drag-helper placeholder-wrap"></div><div class="mfn-wrap-new"><a href="#" class="mfn-item-add mfn-btn btn-icon-left btn-small mfn-btn-blank2"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span>Add element</span></a></div><div class="mcb-wrap-background-overlay"></div></div></div>';
        }

        answer.uid = uid;

        return answer;
    },
    section: function(){
        var uid = getUid();
        //var new_section = {...mfnvbvars.elements.section};

        var section_class = 'mfn-default-section';

        var new_section = {};
        new_section = JSON.parse( JSON.stringify(mfnvbvars.elements.section) );
        new_section.uid = uid;

        new_section.ver = elements_ver;
        section_class = 'mfn-'+elements_ver+'-section';

        if( builder_type == 'header' ){
            // header presets
            new_section.attr['style:.mcb-section-mfnuidelement .section_wrapper:align-items'] = 'center';
            new_section.attr['style:.mcb-section-mfnuidelement .section_wrapper:align-items_tablet'] = 'center';
            new_section.attr['style:.mcb-section-mfnuidelement .section_wrapper:align-items_mobile'] = 'center';
        }

        if( builder_type == 'megamenu' ){
            // megamenu presets
            new_section.attr['style:.mcb-section-mfnuidelement:background-color'] = '#ffffff';
            new_section.attr['style:.mcb-section-mfnuidelement .section_wrapper:align-items'] = 'flex-start';
        }

        mfnvbvars.pagedata.push(new_section);

        let global_sections_html = '';

        if( !$content.find('body').hasClass('mfn-template-section') ) {
            global_sections_html = '<a class="mfn-btn add-global-sections-button mfn-btn-green btn-icon-left" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Global sections</span></a>';
        }

        var answer = {};
        answer.html = '<div data-uid="'+uid+'" data-order="'+$builder.find('.section').length+'" class="section mcb-section mcb-section-new '+section_class+' vb-item mfn-new-item mcb-section-'+uid+' '+ ( builder_type == 'header' ? "mcb-header-section" : "" ) +' blink empty" data-title="Section"> <a href="#" data-tooltip="Add new section" class="btn-section-add mfn-icon-add-light mfn-section-add siblings prev" data-position="before">Add section</a> <div class="section-header mfn-section-sort-handler mfn-header header-large"> <a class="mfn-option-btn mfn-option-blue mfn-element-menu mfn-element-edit" href="#" data-tooltip="Edit section" data-position="right"><span class="mfn-icon mfn-icon-section"></span></a> <div class="options-group"> <a class="mfn-option-btn mfn-option-text mfn-option-green btn-large mfn-wrap-add" title="Add wrap" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">Wrap</span></a> <a class="mfn-option-btn mfn-option-text mfn-option-green btn-large mfn-wrap-add mfn-divider-add" title="Add divider" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">Divider</span></a> </div><div class="options-group"> <a class="mfn-option-btn mfn-option-green btn-large mfn-element-drag mfn-section-drag" title="Drag" data-tooltip="Drag" href="#"><span class="mfn-icon mfn-icon-drag"></span></a> <a class="mfn-option-btn mfn-option-green btn-large mfn-element-edit" title="Edit" data-tooltip="Edit" href="#"><span class="mfn-icon mfn-icon-edit"></span></a> <a class="mfn-option-btn mfn-option-green btn-large mfn-module-clone mfn-section-clone" title="Clone" data-tooltip="Clone" href="#"><span class="mfn-icon mfn-icon-clone"></span></a> <a class="mfn-option-btn mfn-option-green btn-large mfn-element-delete" data-tooltip="Delete" title="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a> <div class="mfn-option-dropdown"> <a class="mfn-option-btn mfn-option-green btn-large" title="More" href="#"><span class="mfn-icon mfn-icon-more"></span></a> <div class="dropdown-wrapper"> <h6>Actions</h6> <a class="mfn-dropdown-item mfn-section-hide" href="#" data-show="Show section" data-hide="Hide section"><span class="mfn-icon mfn-icon-hide"></span><span class="mfn-icon mfn-icon-show"></span><span class="label">Hide section</span></a> <a class="mfn-dropdown-item mfn-section-move-up" href="#"><span class="mfn-icon mfn-icon-move-up"></span> Move up</a><a class="mfn-dropdown-item mfn-section-move-down" href="#"><span class="mfn-icon mfn-icon-move-down"></span> Move down</a><a class="mfn-dropdown-item mfn-section-convert-to-global" href="#"><span class="mfn-icon mfn-icon-convert-section-to-global"></span> Convert to Global</a> <div class="mfn-dropdown-divider"></div><h6>Import / Export</h6> <a class="mfn-dropdown-item mfn-section-export" href="#"><span class="mfn-icon mfn-icon-export"></span> Export section</a> <a class="mfn-dropdown-item mfn-section-import mfn-section-import-replace" href="#"><span class="mfn-icon mfn-icon-import-after"></span> Import & replace</a> <a class="mfn-dropdown-item mfn-section-import mfn-section-import-before" href="#"><span class="mfn-icon mfn-icon-import-after"></span> Import before</a> <a class="mfn-dropdown-item mfn-section-import mfn-section-import-after" href="#"><span class="mfn-icon mfn-icon-import-before"></span> Import after</a> </div></div></div></div><div class="mcb-background-overlay"></div><div class="mfn-shape-divider mfn-shape-divider-top" data-bring-front="0" data-flip="0" data-invert="0" data-name="top"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path></path></svg></div><div class="mfn-shape-divider mfn-shape-divider-bottom" data-bring-front="0" data-flip="0" data-invert="0" data-name="bottom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none"><path></path></svg></div><div class="section_wrapper mcb-section-inner mcb-section-inner-'+uid+'"> <div class="mfn-section-new"> <h5>Select a wrap layout</h5> <div class="wrap-layouts"> <div class="wrap-layout wrap-11" data-type="wrap-11" data-tooltip="1/1"></div><div class="wrap-layout wrap-12" data-type="wrap-12" data-tooltip="1/2 | 1/2"><span></span></div><div class="wrap-layout wrap-13" data-type="wrap-13" data-tooltip="1/3 | 1/3 | 1/3"><span></span><span></span></div><div class="wrap-layout wrap-14" data-type="wrap-14" data-tooltip="1/4 | 1/4 | 1/4 | 1/4"><span></span><span></span><span></span></div><div class="wrap-layout wrap-13-23" data-type="wrap-1323" data-tooltip="1/3 | 2/3"><span></span></div><div class="wrap-layout wrap-23-13" data-type="wrap-2313" data-tooltip="2/3 | 1/3"><span></span></div><div class="wrap-layout wrap-14-12-14" data-type="wrap-141214" data-tooltip="1/4 | 1/2 | 1/4"><span></span><span></span></div></div><p>or choose from</p><a class="mfn-btn prebuilt-button mfn-btn-green btn-icon-left" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>'+( builder_type == 'header' ? 'Pre-built headers' : 'Pre-built sections' )+'</span></a> '+ global_sections_html +' </div></div><a href="#" class="btn-section-add mfn-icon-add-light mfn-section-add siblings next" data-position="after">Add section</a></div>';
        answer.uid = uid;

        return answer;
    },
    item: function(name) {
        var script = false;
        var uid = getUid();
        //var new_item = {...mfnvbvars.elements[name]};

        var new_item = {};
        new_item = JSON.parse( JSON.stringify(renderMfnFields.items[name]) );
        var html = new_item.html.replaceAll('uidhere', uid);

        if( new_item.script ){
            script = new_item.script;
        }

        delete new_item.html;
        delete new_item.script;

        new_item.uid = uid;
        new_item.size = '1/1';
        new_item.tablet_size = '1/1';
        new_item.mobile_size = '1/1';
        new_item.tablet_resized = "0";

        if( builder_type == 'header' ){

            if( name != 'header_logo' ){
                new_item.attr['width_switcher'] = 'inline';
                html = html.replace('vb-item', 'vb-item mfn-item-inline');
            }

            if( name == 'header_logo' || name == 'image' ){
                new_item.attr['width_switcher'] = 'custom';
                new_item.attr['style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement:flex'] = '250px';
            }

            if( name == 'header_search' ){
                new_item.attr['width_switcher'] = 'custom';
                new_item.attr['style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement:flex'] = '300px';
            }

            if( name == 'header_icon' ){
                new_item.attr['style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-icon-box .icon-wrapper .header-cart-count,.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-icon-box .icon-wrapper .header-wishlist-count:top'] = '-9px';
                new_item.attr['style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-icon-box .icon-wrapper .header-cart-count,.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-icon-box .icon-wrapper .header-wishlist-count:right'] = '-11px';
            }

        }

        mfnvbvars.pagedata.push(new_item);

        if( script ){
            var arr = [];
            arr.push(html);
            arr.push(script);
            return arr;
        }else{
            return html;
        }
    }
};

var sizes = [
    {index: 1, key: '1/6', desktop: 'one-sixth', laptop: 'laptop-one-sixth', tablet: 'tablet-one-sixth', mobile: 'mobile-one-sixth', percent: '16.666%'},
    {index: 2, key: '1/5', desktop: 'one-fifth', laptop: 'laptop-one-fifth', tablet: 'tablet-one-fifth', mobile: 'mobile-one-fifth', percent: '20%'},
    {index: 3, key: '1/4', desktop: 'one-fourth', laptop: 'laptop-one-fourth', tablet: 'tablet-one-fourth', mobile: 'mobile-one-fourth', percent: '25%'},
    {index: 4, key: '1/3', desktop: 'one-third', laptop: 'laptop-one-third', tablet: 'tablet-one-third', mobile: 'mobile-one-third', percent: '33.333%'},
    {index: 5, key: '2/5', desktop: 'two-fifth', laptop: 'laptop-two-fifth', tablet: 'tablet-two-fifth', mobile: 'mobile-two-fifth', percent: '40%'},
    {index: 6, key: '1/2', desktop: 'one-second', laptop: 'laptop-one-second', tablet: 'tablet-one-second', mobile: 'mobile-one-second', percent: '50%'},
    {index: 7, key: '3/5', desktop: 'three-fifth', laptop: 'laptop-three-fifth', tablet: 'tablet-three-fifth', mobile: 'mobile-three-fifth', percent: '60%'},
    {index: 8, key: '2/3', desktop: 'two-third', laptop: 'laptop-two-third', tablet: 'tablet-two-third', mobile: 'mobile-two-third', percent: '66%'},
    {index: 9, key: '3/4', desktop: 'three-fourth', laptop: 'laptop-three-fourth', tablet: 'tablet-three-fourth', mobile: 'mobile-three-fourth', percent: '75%'},
    {index: 10, key: '4/5', desktop: 'four-fifth', laptop: 'laptop-four-fifth', tablet: 'tablet-four-fifth', mobile: 'mobile-four-fifth', percent: '80%'},
    {index: 11, key: '5/6', desktop: 'five-sixth', laptop: 'laptop-five-sixth', tablet: 'tablet-five-sixth', mobile: 'mobile-five-sixth', percent: '83.333%'},
    {index: 12, key: '1/1', desktop: 'one', laptop: 'laptop-one', tablet: 'tablet-one', mobile: 'mobile-one', percent: '100%'}
];

const deprecated_fields = {
    item: ['style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-header-menu > li.current-menu-item.mfn-menu-li > a.mfn-menu-link:color','style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-header-menu > li.current-menu-item.mfn-menu-li > a.mfn-menu-link:background-color'],
    wrap: [],
    section: []
};

const rewrited_fields = {
    item: {
        'product_images': [ // added 20.05.2023
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-style',           new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-style'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-color',           new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-color'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-width',           new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-width'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-width_tablet',    new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-width_tablet'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-width_mobile',    new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-width_mobile'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-radius',          new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-radius'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-radius_tablet',   new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-radius_tablet'},
            {old: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .flex-viewport:border-radius_mobile',   new: 'style:.mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-has-gallery .flex-viewport, .mcb-section .mcb-wrap .mcb-item-mfnuidelement .mfn-product-hasnt-gallery .woocommerce-product-gallery__image:border-radius_mobile'}
        ]
    },
    wrap: [],
    section: []
};

var dynamic_data = {
    'labels' : {
        'category': 'Post category',
        'post_tag': 'Post tag',
        'portfolio_types': 'Portfolio category',
        'offer_types': 'Offer category',
        'testimonial_types': 'Testimonial category',
        'product_cat': 'Product category',
    },
    'dynamic' : {
        'posts': {
            'title': [{ key: 'title', label: 'Title' }],
            'permalink': [{key: 'permalink', label: 'Link'}],
            'featured_image': [{key: 'featured_image', label: 'Image'}],
            'content': [{key: 'content', label: 'Content'}, {key: 'excerpt', label: 'Excerpt'}, {key: 'title', label: 'Title'}, {key: 'author', label: 'Author'}, {key: 'date', label: 'Date'}, {key: 'date:modified', label: 'Modified Date'}, {key: 'permalink', label: 'Link'}, {key: 'featured_image', label: 'Image'}, {key: 'featured_image:tag', label: 'Image tag'}],
            'heading': {
                'title': [{key: 'content', label: 'Content'}, {key: 'excerpt', label: 'Excerpt'}, {key: 'author', label: 'Author'}, {key: 'date', label: 'Date'}, {key: 'date:modified', label: 'Modified Date'}]
            },
            'fancy_heading': {
                'title': [{key: 'content', label: 'Content'}, {key: 'excerpt', label: 'Excerpt'}, {key: 'author', label: 'Author'}, {key: 'date', label: 'Date'}, {key: 'date:modified', label: 'Modified Date'}]
            },
            'icon_box_2': {
                'title': [{key: 'content', label: 'Content'}, {key: 'excerpt', label: 'Excerpt'}, {key: 'author', label: 'Author'}, {key: 'date', label: 'Date'}, {key: 'date:modified', label: 'Modified Date'}]
            },
            'product': {
                'title': [{key: 'category', label: 'Main category'}, {key: 'categories', label: 'Categories'}, { key: 'price', label: 'Price' }],
                'content': [{key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}, { key: 'price', label: 'Price' }]
            },
            'post': {
                'content': [{key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}],
                'title': [{key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}]
            },
            'testimonial': {
                'title': [{ key: 'postmeta:mfn-post-link', label: 'Meta Link' }, { key: 'postmeta:mfn-post-author', label: 'Meta Author' }, { key: 'postmeta:mfn-post-company', label: 'Meta Company' }, {key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}],
                'permalink': [{ key: 'postmeta:mfn-post-link', label: 'Meta Link' }],
                'content': [{ key: 'postmeta:mfn-post-link', label: 'Meta Link' }, { key: 'postmeta:mfn-post-author', label: 'Meta Author' }, { key: 'postmeta:mfn-post-company', label: 'Meta Company' }, {key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}]
            },
            'slide': {
                'content': [{ key: 'postmeta:mfn-post-desc', label: 'Meta Description' }, {key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}, { key: 'postmeta:mfn-post-desc', label: 'Meta Desc' }],
                'permalink': [{ key: 'postmeta:mfn-post-link', label: 'Meta Link' }],
                'title': [{key: 'categories', label: 'Categories'}, { key: 'postmeta:mfn-post-desc', label: 'Meta Desc' }, {key: 'category', label: 'Main category'}]
            },
            'offer': {
                'title': [{ key: 'postmeta:mfn-post-link_title', label: 'Meta button text' }, {key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}],
                'permalink': [{ key: 'postmeta:mfn-post-link', label: 'Meta button link' }],
                'featured_image': [{ key: 'postmeta:mfn-post-thumbnail', label: 'Meta thumbnail' }],
                'content': [{key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}]
            },
            'portfolio': {
                'title': [{ key: 'postmeta:mfn-post-client', label: 'Meta client' }, { key: 'postmeta:mfn-post-task', label: 'Meta task' }, {key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}],
                'content': [{ key: 'postmeta:mfn-post-client', label: 'Meta client' }, { key: 'postmeta:mfn-post-task', label: 'Meta task' }, {key: 'categories', label: 'Categories'}, {key: 'category', label: 'Main category'}],
                'permalink': [{ key: 'postmeta:mfn-post-link', label: 'Meta website' }]
            }
        },
        'terms': {
            'title': [{ key: 'title', label: 'Title' }],
            'permalink': [{key: 'permalink', label: 'Link'}],
            'featured_image': [{key: 'featured_image', label: 'Image'}],
            'content': [{key: 'content', label: 'Content'}],
        }
    },
    'global' : {
        'title': [{ key: 'title:site', label: 'Site title' }],
        'permalink': [{ key: 'permalink:site', label: 'Site link' }],
        'featured_image': [{ key: 'featured_image:site', label: 'Site Logo' }],
        'content': [{ key: 'title:site', label: 'Site title' }],
    }
};

var presets_keys = {
    'icon_box_2': ['title_tag', 'icon_position', 'icon_position_tablet', 'icon_position_mobile', 'icon_align', 'icon_align_tablet', 'icon_align_mobile', 'hover'],
    'section': ['width_switcher', 'height_switcher'],
    'wrap': ['width_switcher', 'height_switcher'],
};

var units = ['px', '%', 'em', 'rem', 'vw', 'vh'];

var items_size = {
    'wrap': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],

    'accordion': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'article_box': ['1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'before_after': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blockquote': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog': ['1/1'],
    'blog_news': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog_slider': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'blog_teaser': ['1/1'],
    'button': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'call_to_action': ['1/1'],
    'chart': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'clients': ['1/1'],
    'clients_slider': ['1/1'],
    'code': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'column': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'contact_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'content': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'countdown': ['1/1'],
    'counter': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'divider': ['1/1'],
    'fancy_divider': ['1/1'],
    'fancy_heading': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'feature_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'feature_list': ['1/1'],
    'faq': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'flat_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'helper': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'hover_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'hover_color': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'how_it_works': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'icon_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'image': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'image_gallery': ['1/1'],
    'info_box': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'list': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'map_basic': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'map': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'offer': ['1/1'],
    'offer_thumb': ['1/1'],
    'opening_hours': ['1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'our_team': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'our_team_list': ['1/1'],
    'photo_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'placeholder': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'portfolio': ['1/1'],
    'portfolio_grid': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'portfolio_photo': ['1/1'],
    'portfolio_slider': ['1/1'],
    'pricing_item': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'progress_bars': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'promo_box': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'quick_fact': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'shop': ['1/1'],
    'shop_slider': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'sidebar_widget': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'slider': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'slider_plugin': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'sliding_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'story_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'tabs': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'testimonials': ['1/1'],
    'testimonials_list': ['1/1'],
    'trailer_box': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'timeline': ['1/1'],
    'video': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'visual': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'zoom_box': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'shop_categories': ['1/1'],
    'shop_products': ['1/1'],
    'shop_title': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_title': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_images': ['1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_price': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_cart_button': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_reviews': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_rating': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_stock': ['1/6', '1/5', '1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_meta': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_short_description': ['1/4', '1/3', '2/5', '1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_content': ['1/1'],
    'product_additional_information': ['1/2', '3/5', '2/3', '3/4', '4/5', '5/6', '1/1'],
    'product_related': ['1/1'],
    'product_upsells': ['1/1'],
};

function getUid(){
    return Math.random().toString(36).substring(4);
}

// show shortcode add icon
$('.modal-add-shortcode .browse-icon .mfn-button-upload').on('click', function(e) {
    e.preventDefault();
    $('.mfn-modal.modal-select-icon .mfn-items-list li').removeClass('active');
    $('.mfn-modal.modal-select-icon').addClass('show');
});

function backToWidgets(){
    $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-items .title-group .sidebar-panel-desc .sidebar-panel-title').text('Add element');
    $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-items .title-group .sidebar-panel-icon').attr('class', 'sidebar-panel-icon mfn-icon-add-big');

    if($('.mfn-ui').hasClass('mfn-sidebar-hidden-footer')) $('.mfn-ui').removeClass('mfn-sidebar-hidden-footer');

    $(".panel").hide();
    $(".header").hide();
    $(".panel-items").show();
    $(".header-items").show();
    $('.panel-edit-item .mfn-form');
    $('.mfn-ui').removeClass('mfn-editing-section mfn-editing-wrap mfn-editing-element');
    if( edited_item && typeof edited_item.jsclass !== 'undefined' ) $('.mfn-ui').removeClass('mfn-editing-'+edited_item.jsclass);

    if( $builder.find('.mfn-current-editing').length ) $builder.find('.mfn-current-editing').removeClass('mfn-current-editing');

    $('.panel-items .mfn-search').focus();

    // resetSaveButton();
}

function showPrebuilts() {
    $(".panel").hide();
    $(".header").hide();
    $(".panel-prebuilt-sections").show();
    $(".header-prebuilt-sections").show();
}

function showGlobals( $section_uid ) {
    $(".panel").hide();
    $(".header").hide();
    $(".panel-global-sections").show();
    $(".header-global-sections").show();

    $('.prebuilt-sections-list.global-sections').empty();

    _.map(mfnDbLists['global_sections'], function(el, i){
        if( i > 0 ){
            $('.prebuilt-sections-list.global-sections').append(`<li style="display: block;" class="${ i == $section_uid ? 'active' : ''}" data-id="${i}"><div class="desc"><h6>${el}</h6><a class="mfn-option-btn mfn-option-text btn-icon-left mfn-option-green mfn-btn-insert mfn-insert-global-section" title="Insert" data-tooltip="Insert to your project" href="#"><span class="mfn-icon mfn-icon-add"></span><span class="text">${ i == $section_uid ? 'Selected' : 'Select'}</span></a></div></li>`);
        }
    });

    if( !$('.prebuilt-sections-list.global-sections li').length ){
        $('.prebuilt-sections-list.global-sections').append('<div class="mfn-form-row mfn-vb-formrow "><div class="mfn-alert "><div class="alert-icon mfn-icon-information"></div><div class="alert-content"><p>No global sections have been created yet. If you would like to set global section, please <a target="_blank" href="'+mfnvbvars.adminurl+'edit.php?post_type=template&tab=section">create it first.</a></p></div></div></div>');
    }
}

var enableBeforeUnload = function() {
    if( !$('.mfn-form-options').is(':visible') && !$('.panel-view-themeoptions').is(':visible') ) {
        window.onbeforeunload = function(e) {
            return 'The changes you made will be lost if you navigate away from this page';
        };
    }
};

$('.mfn-visualbuilder .sidebar-panel-content ul.items-list li a').on('click', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(event) {
    catchShortcuts(event);
});

function catchShortcuts(e){
    if((e.ctrlKey || e.metaKey) && e.key == "s") {
        // ctr || cmd + s
        e.preventDefault();
        if(!$('.btn-save-form-primary.btn-save-changes').hasClass('disabled')){
            $('.btn-save-form-primary.btn-save-changes').trigger('click');
        }
        return false;
    }else if((e.ctrlKey || e.metaKey) && e.key == "y") {
        // ctr || cmd + y
        if( !$('.mfn-field-value').is(':focus')  ){
            e.preventDefault();
            if(!$redo.hasClass('loading') && !$redo.hasClass('inactive')){
                $redo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if((e.ctrlKey || e.metaKey) && e.key == "i") {
        // ctr || cmd + i
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-menu nav ul li.menu-navigator a').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key == "Z") {
        // ctr || cmd + shift + z
        if( !$('.mfn-field-value').is(':focus')  ){
            e.preventDefault();
            if(!$redo.hasClass('loading') && !$redo.hasClass('inactive')){
                $redo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if(e.metaKey && e.shiftKey && e.key == "z") {
        // ctr || cmd + shift + z
        if( !$('.mfn-field-value').is(':focus') ){
            e.preventDefault();
            if(!$redo.hasClass('loading') && !$redo.hasClass('inactive')){
                $redo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if(e.ctrlKey && e.shiftKey && e.key === "P") {
        // ctr || cmd + shift + p
        e.preventDefault();
        $('.mfn-visualbuilder a.mfn-preview-generate').trigger('click');
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "p") {
        // ctr || cmd + shift + p
        e.preventDefault();
        $('.mfn-visualbuilder a.mfn-preview-generate').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key === "M") {
        // ctr || cmd + shift + m
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-change-resolution .dropdown-wrapper a[data-preview="desktop"]').trigger('click');
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "m") {
        // ctr || cmd + shift + m
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-change-resolution .dropdown-wrapper a[data-preview="desktop"]').trigger('click');
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "h") {
        // ctr || cmd + shift + h
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-menu nav ul li.menu-revisions a').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key === "H") {
        // ctr || cmd + shift + h
        e.preventDefault();
        $('.mfn-visualbuilder .sidebar-menu nav ul li.menu-revisions a').trigger('click');
        return false;
    }else if(e.ctrlKey && e.shiftKey && e.key === "V") {
        // ctr || cmd + shift + v
        e.preventDefault();
        window.open( $('.mfn-visualbuilder .sidebar-panel-footer a.menu-viewpage').attr('href') );
        return false;
    }else if(e.metaKey && e.shiftKey && e.key == "v") {
        // ctr || cmd + shift + v
        e.preventDefault();
        window.open( $('.mfn-visualbuilder .sidebar-panel-footer a.menu-viewpage').attr('href') );
        return false;
    }else if((e.ctrlKey || e.metaKey) && e.key == "z") {
        // ctr || cmd + z
        if( !$('.CodeMirror-code').is(':focus') && !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$('.panel-edit-item .mfn-field-value').is(':focus') ){
            e.preventDefault();
            if(!$undo.hasClass('loading') && !$undo.hasClass('inactive')){
                $undo.trigger('click');
            }
            return false;
        }else if( $('.panel-edit-item .mfn-field-value:focus').length ){
            setTimeout(function() {
                fieldUpdate($('.panel-edit-item .mfn-field-value:focus'));
            }, 5);
        }
    }else if((e.ctrlKey || e.metaKey) && e.key == "c"){
        // ctr || cmd + c
        if( iframe.window.getSelection().toString() == '' && !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$content.find('input').is(':focus') && !$content.find('textarea').is(':focus') && !$('input').is(':focus') && !$('textarea').is(':focus') && !$('textarea').is(':focus') && !$('.CodeMirror-code').is(':focus') ){
            e.preventDefault();
            if( $content.find('.mfn-current-editing').length ){
                context_el = $content.find('.mfn-current-editing').attr('data-uid');
                copypaste.copy(context_el);
            }
        }
        return false;
    }else if((e.ctrlKey || e.metaKey) && e.key == "v"){
        // ctr || cmd + v
        if( !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$content.find('input').is(':focus') && !$content.find('textarea').is(':focus') && !$('input').is(':focus') && !$('textarea').is(':focus') && !$('.CodeMirror-code').is(':focus') ){
            e.preventDefault();
            if( $content.find('.mfn-current-editing').length ){
                context_el = $content.find('.mfn-current-editing').attr('data-uid');
                let $el = $content.find('.vb-item[data-uid="'+context_el+'"]');
                copypaste.paste($el);
            }
        }
        return false;
    }else if( e.key == "Delete"  ){
        if( !$content.find('.mfn-current-editing .mfn-inline-editor').is(":focus") && !$('input').is(':focus') && !$('textarea').is(':focus') && !$('.CodeMirror-code').is(':focus') ){
            e.preventDefault();

            // Global Wraps -> Prevent removing wrap on template editor
            if( $('body').hasClass('mfn-template-wrap') && $content.find('.mfn-current-editing').hasClass('mcb-section')) {
                return;
            }

            $content.find('.mfn-current-editing').find('.mfn-header').first().find('.mfn-element-delete').trigger('click');
        }
        return false;
    }else if( (e.ctrlKey || e.metaKey) && e.key == "d" ){
        // Global Sections/Wraps -> Prevent duplicating wrap/section on page
        if( ($('body').hasClass('mfn-template-builder-wrap') && $content.find('.mfn-current-editing').hasClass('mcb-wrap')) || ($('body').hasClass('mfn-template-builder-section') && $content.find('.mfn-current-editing').hasClass('mcb-section')) ){
            return false;
        }
        if( $content.find('.mfn-current-editing').hasClass('mfn-global-wrap') || $content.find('.mfn-current-editing').hasClass('mfn-global-section') ) {
            return false;
        }

        // duplicate
        if( $content.find('.mfn-current-editing').length && !$('.mfn-field-value').is(':focus') ){
            e.preventDefault();
            $content.find('.mfn-current-editing').find('.mfn-header').first().find('.mfn-module-clone').trigger('click');
        }
        return false;
    }else if( (e.ctrlKey || e.metaKey) && e.key == "p" ){
        // show/hide left panel
        e.preventDefault();
        $('#mfn-sidebar-switcher').trigger('click');
        return false;
    }else if( e.key == "Enter" ){
        // enter
        if( $('.mfn-modal.show .btn-modal-confirm').length ){
            e.preventDefault();
            $('.mfn-modal.show .btn-modal-confirm').trigger('click');
        }
        if( $('.mfn-modal.modal-display-conditions.show .btn-modal-save').length ){
            e.preventDefault();
            $('.mfn-modal.modal-display-conditions.show .btn-modal-save').trigger('click');
        }
        return false;
    }else if( e.key == "Escape" ){
        // Escape
        if( $('.mfn-modal.show .modalbox-header .btn-modal-close').length ){
            e.preventDefault();
            $('.mfn-modal.show .modalbox-header .btn-modal-close').trigger('click');
        }
        if( $('body').hasClass('mfn-navigator-active') ){
            $('.btn-navigator-switcher').trigger('click');
        }
        return false;
    }else if((e.ctrlKey || e.metaKey) && (e.key == "/" || e.key == "?" ) ) {
        // ctr || cmd + /
        e.preventDefault();
        if(!$('.modal-shortcuts').hasClass('show')){
            $('.modal-shortcuts').addClass('show');
        }
        return false;
    }
}

$('.mfn-visualbuilder .sidebar-panel-content ul.items-list li a').contextmenu(function(e) {

    if( builder_type == 'header' ) return;

    e.preventDefault();

    var type = $(this).closest('li').attr('data-type');

    if( $('.mfn-visualbuilder .sidebar-panel-content ul.fav-items-list li[data-type="'+type+'"]').length ){
        $('.mfn-items-list-contextmenu ul li a[data-action="love-it"] span.label').text('Remove');
    }else{
        $('.mfn-items-list-contextmenu ul li a[data-action="love-it"] span.label').text('Add to favourites');
    }

    item_name = $(e.target).closest('li').attr('data-type');

    var $li = $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li.mfn-item-'+item_name);
    $('.mfn-items-list-contextmenu').show().css({'left':e.clientX, 'top': e.clientY});

    $(document).bind('click', hideLeftItemsContext);
    $content.find('body').bind('click', hideLeftItemsContext);

});

function hideLeftItemsContext(e) {
    var context = $('.mfn-items-list-contextmenu');

    if (!context.is(e.target) && context.has(e.target).length === 0){
       $('.mfn-items-list-contextmenu').hide();
    }

    $(document).unbind('click', hideLeftItemsContext);
    $content.find('body').unbind('click', hideLeftItemsContext);
}

$('.mfn-fav-items-wrapper h5').on('click', function(e) {
    e.preventDefault();
    $('.mfn-fav-items-wrapper').toggleClass('mfn-favs-closed');
    if( $('.mfn-fav-items-wrapper').hasClass('mfn-favs-closed') ){
        $('.mfn-fav-items-content').slideUp(300);
    }else{
        $('.mfn-fav-items-content').slideDown(300);
    }
});

$('.mfn-items-list-contextmenu ul li a').on('click', function(e) {
    e.preventDefault();

    if (mfnvbvars.view == 'demo') return;

    var action = $(this).attr('data-action');

    $('.mfn-items-list-contextmenu').hide();

    if( action == 'love-it' ){
        $.ajax( mfnajaxurl, {
          type : "POST",
          data : {
            'mfn-builder-nonce': wpnonce,
            action: 'mfn_builder_favorites',
            item: item_name
          }

        }).done(function(response){
            if( response == 'set'){
                $('.mfn-fav-items-wrapper ul.fav-items-list').append( $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li[data-type="'+item_name+'"]').clone(true) );
            }else{
                $('.mfn-fav-items-wrapper ul.fav-items-list li[data-type="'+item_name+'"]').remove();
            }

            if( !$('.mfn-fav-items-wrapper ul.fav-items-list li').length ){
                $('.mfn-fav-items-wrapper').removeClass('isset-favs').addClass('empty-favs');
            }else{
                $('.mfn-fav-items-wrapper').addClass('isset-favs').removeClass('empty-favs');
            }
        });
    }
});

function init() {

    iframeReady(); // sections toolbar buttons

    uploader.browse();
    uploader.delete();
    uploader.deleteAllGallery();
    uploader.sortable();

    var mac = /(Mac)/i.test(navigator.platform);

    if (mac) {
        $content.find('body').addClass('mfn-mac');
        $('body').addClass('mfn-mac');
    }

    if(window.location.hash && window.location.hash == '#page-options-tab') {
        $(window.location.hash).trigger('click');
    }

    $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').on('mousedown', function(e) {
        if (e.which != 3) calculateIframeHeight();
    }).on('mouseup', resetIframeHeight);

    if($content.find('.masonry').length){
        $content.find('.masonry').each(function() {
            $(this).addClass('mfn-initialized');
        });
    }

    document.getElementById('mfn-vb-ifr').contentWindow.addEventListener('keydown', function(event) {
        catchShortcuts(event);
    });

    if($content.find('.isotope').length){
        $content.find('.isotope').each(function() {
            $(this).addClass('mfn-initialized');
        });
    }

    if(!mfnbuilder.clipboard){
        $content.find('.section-header .mfn-section-import').addClass('mfn-disabled');
    }

    if( builder_type == 'standard' && $content.find('.mfn-shop-archive-tmpl-builder').length ){
        $content.find('.mfn-shop-archive-tmpl-builder').addClass('block-pointer-inside').append('<a href="'+mfnvbvars.adminurl+'post.php?post='+$content.find('.mfn-shop-archive-tmpl-builder').attr("data-id")+'&action='+(mfnvbvars.be_slug == 'be' || mfnvbvars.be_slug == 'mfn' ? 'mfn' : mfnvbvars.be_slug)+'-live-builder" target="_blank" data-tooltip="Edit Shop Template" class="btn-edit-template" data-position="before">Edit shop template</a>');
    }

    if( $content.find('.mfn-main-slider.mfn-rev-slider').length ){
        $content.find('.mfn-main-slider.mfn-rev-slider').append('<a href="'+mfnvbvars.adminurl+'admin.php?page=revslider&view=slide&alias='+mfnvbvars.rev_slider_id+'" target="_blank" data-tooltip="Edit with Slider Revolution" class="btn-edit-slider" data-position="before">Edit Slider</a>');
    }

    if( $content.find('.mfn-global-section').length ){
        const globalSections = $content.find('.mfn-global-section');
        globalSections.each( (index, item) => {
            $(item).append('<a href="'+mfnvbvars.adminurl+'post.php?post='+$(item).attr('data-mfn-global')+'&action=mfn-live-builder" target="_blank" data-tooltip="Edit Global Section" class="btn-edit-section" data-position="before">Edit Global Section</a>');
        })
    }


    if( $content.find('.mfn-global-wrap').length ){
        const globalWraps = $content.find('.mfn-global-wrap');
        globalWraps.each( (index, item) => {
            $(item).append('<a href="'+mfnvbvars.adminurl+'post.php?post='+$(item).attr('data-mfn-global')+'&action=mfn-live-builder" target="_blank" data-tooltip="Edit Global Wrap" class="btn-edit-wrap" data-position="before">Edit Global Wrap</a>');
        })
    }

    if( $content.find('#Footer').length ){
        $content.find('#Footer').append('<a href="'+mfnvbvars.adminurl+'widgets.php" target="_blank" data-tooltip="Edit Footer" class="btn-edit-footer" data-position="before">Edit Footer</a>');
    }

    if( $content.find('#Header_creative').length ){
        $content.find('#Header_creative').append('<a href="'+mfnvbvars.adminurl+'admin.php?page='+mfnvbvars.be_slug.replace('mfn', 'be')+'-options#header" target="_blank" data-tooltip="Edit Header" class="btn-edit-header" data-position="before">Edit Header</a>');
    } else if( $content.find('#Top_bar').length ){
        $content.find('#Top_bar').append('<a href="'+mfnvbvars.adminurl+'admin.php?page='+mfnvbvars.be_slug.replace('mfn', 'be')+'-options#header" target="_blank" data-tooltip="Edit Header" class="btn-edit-header" data-position="before">Edit Header</a>');
    }

    if( $content.find('.mfn-header-tmpl-builder:not(.mfn-builder-active)').length ){
      if (mfnvbvars.view == 'demo'){
        $content.find('.mfn-header-tmpl-builder:not(.mfn-builder-active)').append('<a href="https://muffingroup.com/betheme/header-builder/" target="_blank" data-tooltip="Customize every part of your site with Betheme’s new Header Builder. Learn more about it here." class="btn-edit-header" data-position="before">Edit Header</a>');
      } else {
        $content.find('.mfn-header-tmpl-builder:not(.mfn-builder-active)').append('<a href="'+mfnvbvars.adminurl+'post.php?post='+$content.find('.mfn-header-tmpl').attr("data-id")+'&action='+(mfnvbvars.be_slug == 'be' || mfnvbvars.be_slug == 'mfn' ? 'mfn' : mfnvbvars.be_slug)+'-live-builder" target="_blank" data-tooltip="Edit Header" class="btn-edit-header" data-position="before">Edit Header</a>');
      }
    }

    if( $content.find('.mfn-footer-tmpl-builder:not(.mfn-builder-active)').length ){
      if (mfnvbvars.view == 'demo'){
        $content.find('.mfn-footer-tmpl-builder:not(.mfn-builder-active)').append('<a href="https://muffingroup.com/betheme/header-builder/" target="_blank" data-tooltip="Customize every part of your site with Betheme’s new Footer Builder. Learn more about it here." class="btn-edit-footer" data-position="before">Edit Footer</a>');
      } else {
        $content.find('.mfn-footer-tmpl-builder:not(.mfn-builder-active)').append('<a href="'+mfnvbvars.adminurl+'post.php?post='+$content.find('.mfn-footer-tmpl').attr("data-id")+'&action='+(mfnvbvars.be_slug == 'be' || mfnvbvars.be_slug == 'mfn' ? 'mfn' : mfnvbvars.be_slug)+'-live-builder" target="_blank" data-tooltip="Edit Footer" class="btn-edit-footer" data-position="before">Edit Footer</a>');
      }
    }

    $('.mfn-preloader .loading-text').fadeOut(function() {
        $('.mfn-preloader .loading-text').html('Generating page local CSS <div class="dots"></div>');
    }).fadeIn();

    checkEmptyWraps();
    checkEmptyPage();
    checkEmptySections();

    Transforms.attachInitialMargins();

    modernmenu.start();
    settings.start();

    dynamicData.init();

    historyStorage.init();

    $('.mfn-preloader').fadeOut(500, function() {
        $('body').removeClass('mfn-preloader-active');
    });

}

function loopAllStyleFields(uid = false){
    var copied = [];

    if( uid ){
        copied = mfnvbvars.pagedata.filter( (item) => item.uid == uid );
    }else{
        copied = mfnvbvars.pagedata;
    }



    $.each(copied, function(i, v) {
        if( v.uid == 'pageoptions' ){
            $.each(v, function(a, attr) {
                if( a.includes('style:') ) {
                    a = a.replaceAll('mfnuidelement', v.uid).replaceAll('postid', pageid);
                    grabArrStyle(a, attr, v.uid);
                }
            });
        }else{
            $.each(v.attr, function(a, attr) {
                if( a.includes('style:') ) {
                    a = a.replaceAll('mfnuidelement', v.uid).replaceAll('postid', pageid);
                    grabArrStyle(a, attr, v.uid);
                }
            });
        }
    });

    copied = [];
}

$('#mfn-sidebar-switcher').on('click', function() {
    var $sidebar = $('.mfn-visualbuilder .sidebar-wrapper');
    var sidebarW = $sidebar.outerWidth();

    if( $('.mfn-visualbuilder').hasClass('sidebar_hidden') ){
        $('.mfn-visualbuilder').removeClass('sidebar_hidden');
        $content.find('body').removeClass('sidebar_hidden');
        $sidebar.css({ 'left': '0'});
        $('.mfn-visualbuilder .preview-wrapper').css({'margin-left': sidebarW+'px'});
    }else{
        $('.mfn-visualbuilder').addClass('sidebar_hidden');
        $sidebar.css({ 'left': '-'+sidebarW+'px'});
        $('.mfn-visualbuilder .preview-wrapper').css({'margin-left': '0'});
        $content.find('body').addClass('sidebar_hidden');
    }
});

/* Sidebar Resizer */

var resizer = document.getElementById('mfn-sidebar-resizer');
var sidebar = document.getElementById('mfn-vb-sidebar');
var preview = document.getElementById('mfn-preview-wrapper-holder');
var startY, startX, startWidth, endWidth = 420;

resizer.addEventListener('mousedown', initDrag, false);

function initDrag(e) {
    startX = e.clientX;
    sidebar.classList.add("resizing-active");
    startWidth = parseInt(sidebar.offsetWidth, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
}

function doDrag(e) {
    endWidth = (startWidth + e.clientX - startX);
    if(endWidth < 1200 && endWidth > 400){
        sidebar.style.width = endWidth+"px";
        sidebar.style.maxWidth = endWidth+"px";
        preview.style.marginLeft = endWidth+"px";

        if( endWidth > 800 ){
            $('.mfn-visualbuilder .sidebar-wrapper').addClass('mfn-items-4-columns').removeClass('mfn-items-3-columns');
        }else if( endWidth > 550 ){
            $('.mfn-visualbuilder .sidebar-wrapper').addClass('mfn-items-3-columns').removeClass('mfn-items-4-columns');
        }else{
            $('.mfn-visualbuilder .sidebar-wrapper').removeClass('mfn-items-3-columns mfn-items-4-columns');
        }
    }
}

function stopDrag(e) {
    sidebar.classList.remove("resizing-active");
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
}

let historyStorage = {
    object: function() {
        return localStorage.getItem('mfnhistory') ? JSON.parse(localStorage.getItem('mfnhistory')) : [];
    },
    init: function() {
        historyStorage.add();
        historyStorage.click();
    },
    add: function() {
        // addHistory historyStorage.add()
        if( !historyAllow ) return;

        let history = historyStorage.object();

        if( historyIndex > 0){
            history = history.filter( (y,x) => x >= historyIndex );
        }

        historyIndex = 0;

        $('.sidebar-panel-footer .mfn-history-btn.btn-undo').addClass('loading');

        history.unshift({
            'form': mfnvbvars.pagedata,
            'pageid': pageid,
            'html': $builder.html()
        });

        try {
            localStorage.setItem('mfnhistory', JSON.stringify( history.filter((item,i) => { return i < 11 }) ));
        } catch (e) {
            try {
                localStorage.setItem('mfnhistory', JSON.stringify( history.filter((item,i) => { return i < 2 }) ));
            } catch (e) {
                console.log('Memory limit');
            }
        }

        history = false;

        $('.sidebar-panel-footer .mfn-history-btn.btn-undo').removeClass('loading');
        historyStorage.index();
    },
    click: function() {
         $('.sidebar-panel-footer .mfn-history-btn').on('click', function(e) {
            e.preventDefault();
            $el = $(this);

            let history = historyStorage.object();

            if(!$el.hasClass('inactive') && !$el.hasClass('loading')){

                let historyAction = 'undo';

                if( $el.hasClass('btn-redo') && historyIndex > 0 ){
                    historyAction = 'redo';
                    historyIndex--;
                }else if( $el.hasClass('btn-undo') && historyIndex <= history.length ){
                    historyIndex++;
                }else{
                    $el.addClass('inactive');
                    return;
                }

                $el.addClass('loading');
                $content.find('body').addClass('mfn-loading');

                historyStorage.restore(historyAction, historyIndex);

            }

        });
    },
    index: function() {
        let history = historyStorage.object();

        if(historyIndex < history.length-1){
            $undo.removeClass('inactive');
        }else{
            $undo.addClass('inactive');
        }

        if(historyIndex < 1){
            $redo.addClass('inactive');
        }else{
            $redo.removeClass('inactive');
        }
        history = false;
    },
    restore: function(historyAction, historyIndex) {
        let history = historyStorage.object();
        var h_event = history[historyIndex];

        if( !h_event ) {
            historyStorage.index();
            $('.sidebar-panel-footer .mfn-history-btn').removeClass('loading');
            return;
        }

        if( h_event.pageid != pageid ) return;

        edited_item = false;

        mfnvbvars.pagedata = h_event.form;
        $builder.html( h_event.html );

        if( $builder.find('.mfn-initialized').length ){
            $builder.find('.mfn-initialized').removeClass('mfn-initialized mfn-watchChanges mfn-blur-action mfn-focused').removeAttr('data-medium-editor-element medium-editor-index');
            inlineEditors = [];
        }

        setTimeout(function() {
            if( h_event.uid && $builder.find('.vb-item[data-uid="'+h_event.uid+'"]').length ){
                $builder.find('.vb-item[data-uid="'+h_event.uid+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
                if( h_event.tab ) $('.mfn-ui .mfn-form .sidebar-panel-content-tabs li.spct-li-'+h_event.tab).trigger('click');
            }else{
                backToWidgets();
            }
        }, 100);

        $('.sidebar-panel-footer .mfn-history-btn').removeClass('loading');
        $content.find('body').removeClass('mfn-loading');

        history = false;

        $content.find("style.mfn-local-style").remove();

        blink( true );
        runAjaxElements();
        inlineEditor();
        loopAllStyleFields();
        historyStorage.index();

        checkEmptyPage();
        checkEmptySections();
        checkEmptyWraps();

        runSorting();

    }
}


function calculateIframeHeight(){
    $content.find('body').addClass('hover');
    scroll_top = $content.find("html, body").scrollTop();
    if( builder_type != 'header' ) $('.frameOverlay').height( $content.find("body").height() );
    $content.find("html").css({ 'overflow': 'hidden' });
    $(window).scrollTop( scroll_top );
    $('iframe#mfn-vb-ifr').css({ 'margin-top': scroll_top });
    $(window).on('scroll', function() {
        $content.find('html, body').scrollTop( $(this).scrollTop() );
        $('iframe#mfn-vb-ifr').css({ 'margin-top': $(this).scrollTop() });
    });
    runSorting();
}

function resetIframeHeight(){
    $(window).off('scroll');
    if( builder_type == 'header' ){
        $content.find("html").css({ 'overflow': 'hidden' });
    }else{
        $content.find("html").css({ 'overflow': 'auto' });
    }
    //$content.find('html, body').scrollTop( 0 );
    $('.frameOverlay').removeAttr('style');
    $('iframe#mfn-vb-ifr').css('margin-top', 0);

    runSorting();
}

function hideContext(e) {
    var context = $content.find('.mfn-builder-area-contextmenu');

    if (!context.is(e.target) && context.has(e.target).length === 0){
       $content.find('.mfn-builder-area-contextmenu').hide();
    }

    $content.find('body').unbind('click', hideContext);
}

function hideContextEditor(e) {
    var context = $('.mfn-builder-area-contextmenu');

    if (!context.is(e.target) && context.has(e.target).length === 0){
       $('.mfn-builder-area-contextmenu').hide();
    }

    $('body').unbind('click', hideContextEditor);
}

function iframeReady(){
    sliderInput.unitChange();
    sliderInput.customValue();
    presets.init();

    $content.on('click', '.mfn-rev-slider a:not(.btn-edit-slider), .mcb-column-inner div:not(.mfn-header) a:not(.btn-edit-slider), .mcb-column-inner > a, .mfn-footer-stickymenu a', function(e) {
        e.preventDefault();
    });

    if( builder_type == 'header' ){
        $builder = $content.find('.mfn-header-tmpl-builder');
    }else if( builder_type == 'megamenu' ){
        $builder = $content.find('.mfn-megamenu-tmpl-builder');
    }else if( builder_type == 'sidemenu' ){
        $builder = $content.find('.mfn-sidemenu-tmpl-builder');
    }else if( builder_type == 'popup' ){
        $builder = $content.find('.mfn-popup-tmpl-builder .mfn-popup-tmpl-content-wrapper');
    }else if( builder_type == 'footer' ){
        $builder = $content.find('.mfn-footer-tmpl-builder');
    }else if( builder_type == 'shop-archive' ){
        $builder = $content.find('.mfn-shop-archive-tmpl-builder');
    }else if( builder_type == 'single-post' ){
        $builder = $content.find('.mfn-single-post-tmpl-builder');
    }else if( builder_type == 'single-product' ){
        $builder = $content.find('.mfn-single-product-tmpl-builder');
    }else if( builder_type == 'default' ){
        $builder = $content.find('.mfn-default-tmpl-builder');
    }else if( builder_type == 'section' ){
        $builder = $content.find('.mfn-section-tmpl-builder');
    }else if( builder_type == 'wrap' ){
        $builder = $content.find('.mfn-wrap-tmpl-builder');
    }else{
        $builder = $content.find('.mfn-default-content-buider');
    }

    $builder.addClass('mfn-builder-active');

    if( builder_type == 'megamenu' ){
        var page_options = mfnvbvars.pagedata.filter( (item) => item.uid == 'pageoptions' )[0];
        if( typeof page_options['megamenu_width'] !== "undefined" && page_options['megamenu_width'] == 'custom-width' ) {
            $content.find('.mfn-megamenu-wrapper').css('width', page_options['megamenu_custom_width']);
        }else if( typeof page_options['megamenu_width'] !== "undefined" && page_options['megamenu_width'] == 'full-width' ){
            $content.find('.mfn-megamenu-wrapper').addClass('mfn-megamenu-full-width').removeAttr('style');
        }

        page_options = false;
    }

    if( builder_type == 'header' ){
        headerTmpl.init();
        $content.find("html").css({ 'overflow': 'hidden' });
    }

    // add element button in wrap
    $builder.on('click', '.mfn-item-add', function(e) {
        e.preventDefault();
        backToWidgets();
    });

    if( $content && $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery').length ){
        $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery').addClass('mfn-initialized');
    }

    // sections context menu
    $builder.on('click', '.section .mfn-option-dropdown .dropdown-wrapper a.mfn-dropdown-item', function(e) {
        e.preventDefault();

        let $it = $(this).closest('.mcb-section');
        let sec_uid = $it.data('uid');
        let sections_count = $content.find('.mcb-section').length-1;

        if($(this).hasClass('mfn-section-hide')){
            // hide
            if($it.hasClass('hide')){
                $(this).find('.label').text($(this).attr('data-hide'));
                //$('.mfn-vb-'+sec_uid+' .mfn-type-section.hide input').val('');
                if( typeof mfnvbvars.pagedata.filter( (item) => item.uid == sec_uid )[0]['attr']['hide'] !== 'undefined' ){
                    delete( mfnvbvars.pagedata.filter( (item) => item.uid == sec_uid )[0]['attr']['hide'] );
                }
            }else{
                $(this).find('.label').text($(this).attr('data-show'));
                //$('.mfn-vb-'+sec_uid+' .mfn-type-section.hide input').val('1');
                mfnvbvars.pagedata.filter( (item) => item.uid == sec_uid )[0]['attr']['hide'] = '1';
            }
            $it.toggleClass('hide');
        }else if($(this).hasClass('mfn-section-move-down')){
            // move down
            if($it.attr('data-order') < sections_count){
                $it.insertAfter($it.next());

                historyStorage.add();
            }
        }else if($(this).hasClass('mfn-section-move-up')){
            // move up
            if($it.attr('data-order') > 0){
                $it.insertBefore($it.prev());

                historyStorage.add();
            }
        }else if( $(this).hasClass('mfn-section-export') ){
            // export
            elementToClipboard(sec_uid);
        }else if( !$(this).hasClass('mfn-disabled') && $(this).hasClass('mfn-section-import-before') ){
            // import before
            importFromClipboard(sec_uid, 'before');
        }else if( !$(this).hasClass('mfn-disabled') && $(this).hasClass('mfn-section-import-after') ){
            // import after
            importFromClipboard(sec_uid, 'after');
        }else if( !$(this).hasClass('mfn-disabled') && $(this).hasClass('mfn-section-import-replace') ){
            // import & replace - for global sections
            importFromClipboard(sec_uid, 'replace');
        }else if( !$(this).hasClass('mfn-disabled') && $(this).hasClass('mfn-section-convert-to-global') ){
            GlobalSections.convertToGlobal( sec_uid );
        }

    });

    // add new section "+" addnewsection addsection
    $builder.on('click', '.mfn-section-add', function(e) {
        e.preventDefault();

        if(!$content.find('.mfn-section-add').hasClass('loading')){

            $content.find('.mfn-section-add').addClass('loading');

            var new_element = elements.section();
            //var navigator_html = navigatorHtml('Section', new_element.uid);

            let uid = $(this).parent().data('uid');
            let count = $content.find('.mcb-section').length;
            let placement = 'next';
            if($(this).hasClass('prev')){placement = 'prev';}

            removeStartBuilding();

            if (typeof(uid) !== 'undefined') {
                if(placement == 'prev'){
                    $builder.find('.mcb-section[data-uid='+uid+']').before( new_element.html );

                    //$navigator.find('.navigator-tree .nav-'+uid).before(navigator_html);
                }else{
                    $builder.find('.mcb-section[data-uid='+uid+']').after( new_element.html );

                    //$navigator.find('.navigator-tree .nav-'+uid).after(navigator_html);
                }
            }else{
                $builder.prepend( new_element.html );
                //$navigator.find('.navigator-tree').prepend(navigator_html);
            }

            $content.find('.mfn-section-add').removeClass('loading');

            loopAllStyleFields(new_element.uid);

            if($('body').hasClass('mfn-navigator-active')) be_navigator.show(new_element.uid);

            blink();

        }
    });

    $builder.on('click', '.wrap-layout', function(e) {
        e.preventDefault();
        if(!$content.find('.wrap-layouts').hasClass('loading')){

            //var navigator_tree = '';

            $content.find('.wrap-layouts').addClass('loading');

            let section = $(this).parent().parent().parent().parent().data('order');
            let id = $(this).closest('.section.vb-item').attr('data-uid');
            let type = $(this).data('type');

            if($builder.find('.mcb-section-'+id+' .mfn-section-new').length){ $builder.find('.mcb-section-'+id+' .mfn-section-new').remove(); }

            if( type == 'wrap-141214' ){
                var new_element = elements.wrap('1/4');
                var new_element2 = elements.wrap('1/2');
                var new_element3 = elements.wrap('1/4');
                /*navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/2');
                navigator_tree += navigatorHtml('Wrap', new_element3.uid, '1/4');*/
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element3.html );
            }else if( type == 'wrap-2313' ){
                var new_element = elements.wrap('2/3');
                var new_element2 = elements.wrap('1/3');
                /*navigator_tree += navigatorHtml('Wrap', new_element.uid, '2/3');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/3');*/
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element2.html );
            }else if( type == 'wrap-1323' ){
                var new_element = elements.wrap('1/3');
                var new_element2 = elements.wrap('2/3');
                /*navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/3');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '2/3');*/
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element2.html );
            }else if( type == 'wrap-14' ){
                var new_element = elements.wrap('1/4');
                var new_element2 = elements.wrap('1/4');
                var new_element3 = elements.wrap('1/4');
                var new_element4 = elements.wrap('1/4');
                /*navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element3.uid, '1/4');
                navigator_tree += navigatorHtml('Wrap', new_element4.uid, '1/4');*/
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element3.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element4.html );
            }else if( type == 'wrap-13' ){
                var new_element = elements.wrap('1/3');
                var new_element2 = elements.wrap('1/3');
                var new_element3 = elements.wrap('1/3');
                /*navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/3');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/3');
                navigator_tree += navigatorHtml('Wrap', new_element3.uid, '1/3');*/
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element3.html );
                loopAllStyleFields(new_element.uid);
                loopAllStyleFields(new_element2.uid);
                loopAllStyleFields(new_element3.uid);
            }else if( type == 'wrap-12' ){
                var new_element = elements.wrap('1/2');
                var new_element2 = elements.wrap('1/2');
                /*navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/2');
                navigator_tree += navigatorHtml('Wrap', new_element2.uid, '1/2');*/
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element2.html );
                loopAllStyleFields(new_element.uid);
                loopAllStyleFields(new_element2.uid);
            }else{
                var new_element = elements.wrap('1/1');
                //navigator_tree += navigatorHtml('Wrap', new_element.uid, '1/1');
                $builder.find('.mcb-section-'+id+' .section_wrapper').append( new_element.html );
                loopAllStyleFields(new_element.uid);
            }

            if($content.find('.mcb-section-'+id+' .mfn-section-new').length){ $content.find('.mcb-section-'+id+' .mfn-section-new').remove(); }
            if($content.find('.mcb-section-'+id).hasClass('empty')){ $content.find('.mcb-section-'+id).removeClass('empty'); }

            /*if( !$navigator.find('.navigator-tree .nav-'+id+' ul').length ){
                $navigator.find('.navigator-tree .nav-'+id).append('<ul class="mfn-sub-nav">'+navigator_tree+'</ul>');
            }else{
                $navigator.find('.navigator-tree .nav-'+id+' > ul').append(navigator_tree);
            }*/

            backToWidgets();

            $content.find('.wrap-layouts').removeClass('loading');

            checkWrapsCount(id);

            if($('body').hasClass('mfn-navigator-active')) be_navigator.show(id);

            blink();

            runSorting();

        }

    })

    $builder.on('click', '.prebuilt-button', function(e) {
        e.preventDefault();
        showPrebuilts();
        prebuiltType = $(this).closest('.mcb-section').data('uid');
    });

    $builder.on('click', '.add-global-sections-button', function(e) {
        e.preventDefault();
        showGlobals();
    });

    $content.find('body').append('<div style="position: absolute; z-index: 999;" class="mfn-contextmenu mfn-builder-area-contextmenu"><h6 class="mfn-context-header">Section</h6><ul><li class="mfn-contextmenu-edit"><a href="#" data-action="edit"><span class="mfn-icon mfn-icon-edit"></span><span class="label">Edit</span></a></li><li class="mfn-contextmenu-copy"><a href="#" class="mfn-context-copy" data-action="copy"><span class="mfn-icon mfn-icon-copy"></span><span class="label">Copy</span></a></li><li class="mfn-contextmenu-paste"><a href="#" class="mfn-context-paste" data-action="paste"><span class="mfn-icon mfn-icon-paste"></span><span class="label">Paste</span></a></li><li class="mfn-contextmenu-copystyle"><a href="#" class="mfn-context-copy" data-action="copy"><span class="mfn-icon mfn-icon-copy-style"></span><span class="label">Copy style</span></a></li><li class="mfn-contextmenu-pastestyle"><a href="#" class="mfn-context-paste-style" data-action="paste-style"><span class="mfn-icon mfn-icon-paste-style"></span><span class="label">Paste style</span></a></li><li class="mfn-contextmenu-resetstyle"><a href="#" class="mfn-context-reset-style" data-action="reset-style"><span class="mfn-icon mfn-icon-reset-style"></span><span class="label">Reset style</span></a></li><li class="mfn-contextmenu-save-preset preset-action-button"><a href="#" data-action="save-preset"><span class="mfn-icon mfn-icon-preset"></span><span class="label">Save as preset</span></a></li><li class="mfn-contextmenu-convert-global-section global-section-action-button"><a href="#" data-action="convert-global-section"><span class="mfn-icon mfn-icon-convert-section-to-global"></span><span class="label">Convert to Global</span></a></li><li class="mfn-contextmenu-navigator"><a href="#" data-action="navigator"><span class="mfn-icon mfn-icon-navigator"></span><span class="label">Navigator</span></a></li><li class="mfn-contextmenu-delete"><a href="#" data-action="delete"><span class="mfn-icon mfn-icon-delete-red"></span><span class="label">Delete</span></a></li></ul></div>');

    $builder.on('click', '.mfn-element-drag', function(e) { e.preventDefault(); });

    $builder.on('click', '.mfn-header .mfn-option-dropdown a', function(e) { e.preventDefault(); });

    // inline editor preven default
    $builder.on('click', '.mfn-inline-editor a', function(e) {
        e.preventDefault();

    });

    // Context menu for builder
    $builder.contextmenu(function(e) {
        if( $('#mfn-visualbuilder.mfn-ui').hasClass('sidebar_hidden') || $(e.target).closest('.mfn-global-section').length || $(e.target).closest('.mfn-global-wrap').length )  return;
        e.preventDefault();

        if(e.target.closest('.vb-item')){

            var diff = iframe.window.jQuery('body').width() - e.pageX;

            if(  diff < 200 ){
                $content.find('.mfn-builder-area-contextmenu').css({'right': 0, 'left': 'initial'});
            }else{
                $content.find('.mfn-builder-area-contextmenu').css({'left': e.pageX, 'right': 'initial'});
            }

            $content.find('.mfn-builder-area-contextmenu').show().css({top: e.pageY});

            context_el = $(e.target).closest('.vb-item').attr('data-uid');

            var this_el = mfnvbvars.pagedata.filter( (item) => item.uid == context_el )[0];

            if( $(e.target).closest('.vb-item').hasClass('mcb-section')){
                $content.find('.mfn-builder-area-contextmenu').attr('data-edited', 'Section');

                $content.find('.mfn-builder-area-contextmenu .mfn-context-header').html('Section');
            }else if( $(e.target).closest('.mcb-column-inner').length ){
                $content.find('.mfn-builder-area-contextmenu').attr('data-edited', this_el.title);

                $content.find('.mfn-builder-area-contextmenu .mfn-context-header').html( this_el.title );
            }else{
                $content.find('.mfn-builder-area-contextmenu').attr('data-edited', 'Wrap');

                context_el = $(e.target).closest('.mcb-wrap').attr('data-uid');
                $content.find('.mfn-builder-area-contextmenu .mfn-context-header').html('Wrap');
            }

            if(!mfncopy){
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste').addClass('mfn-context-inactive');
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }else{
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste').removeClass('mfn-context-inactive');
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').removeClass('mfn-context-inactive');
            }

            var copied_el = mfnvbvars.pagedata.filter( (item) => item.uid == mfncopy )[0];

            if( !copied_el || !this_el || this_el.jsclass != copied_el.jsclass ){
                $content.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }

            if( this_el.jsclass == 'section' ){
                $content.find('.mfn-builder-area-contextmenu .mfn-contextmenu-convert-global-section').show();
            }else{
                $content.find('.mfn-builder-area-contextmenu .mfn-contextmenu-convert-global-section').hide();
            }


            /** PBL BE SECTIONS WRAPS */
            const isGlobalSection = $content.find('body').hasClass('mfn-template-section');
            const isGlobalWrap = $content.find('body').hasClass('mfn-template-wrap');
            const isSectionEdited = $content.find('.mfn-builder-area-contextmenu').find('.mfn-context-header').attr('data-element') === 'Section';
            const isWrapEdited = $content.find('.mfn-builder-area-contextmenu').find('.mfn-context-header').attr('data-element') === 'Wrap';



            if( isGlobalSection && isSectionEdited ) {
                $content.find('.mfn-builder-area-contextmenu').attr('hide-ui', 'section');
            } else if( isGlobalWrap && isWrapEdited ) {
                $content.find('.mfn-builder-area-contextmenu').attr('hide-ui', 'wrap');
            } else {
                $content.find('.mfn-builder-area-contextmenu').removeAttr('hide-ui');
            }

        }

        $content.find('body').bind('click', hideContext);
    });

    // Context menu for navigator
    $navigator.contextmenu(function(e) {
        if( $('#mfn-visualbuilder.mfn-ui').hasClass('sidebar_hidden') || $(e.target).closest('.toggle-disabled').length ) return;
        e.preventDefault();

        if( $(e.target).closest('li') ){

            context_el = $(e.target).attr('data-uid');

            $('.mfn-builder-area-contextmenu').show().css({left:e.pageX, top: e.pageY});

            if( $(e.target).closest('li').hasClass('navigator-section')){
                $('.mfn-builder-area-contextmenu .mfn-context-header').html('Section').attr('data-element', 'Section');
            }else if( $(e.target).closest('li').hasClass('navigator-wrap')){
                $('.mfn-builder-area-contextmenu .mfn-context-header').html('Wrap').attr('data-element', 'Wrap');
            }else if( $(e.target).closest('li').hasClass('navigator-item')){
                $('.mfn-builder-area-contextmenu .mfn-context-header').html('Item').attr('data-element', 'Item');
            }

            if(!mfncopy){
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste').addClass('mfn-context-inactive');
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }else{
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste').removeClass('mfn-context-inactive');
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').removeClass('mfn-context-inactive');
            }

            if( mfncopy && $('.mfn-vb-'+context_el).attr('data-item') != $('.mfn-vb-'+mfncopy).attr('data-item') ){
                $navigator.find('.mfn-builder-area-contextmenu .mfn-context-paste-style').addClass('mfn-context-inactive');
            }



            $('body').bind('click', hideContextEditor);

            /** PBL BE SECTIONS WRAPS */
            const isGlobalSection = $('body').hasClass('mfn-template-section');
            const isGlobalWrap = $('body').hasClass('mfn-template-wrap');
            const isSectionEdited = $('.mfn-builder-area-contextmenu').find('.mfn-context-header').attr('data-element') === 'Section';
            const isWrapEdited = $('.mfn-builder-area-contextmenu').find('.mfn-context-header').attr('data-element') === 'Wrap';


            if( isGlobalSection && isSectionEdited ) {
                $('.mfn-builder-area-contextmenu').attr('hide-ui', 'section');
            } else if( isGlobalWrap && isWrapEdited ) {
                $('.mfn-builder-area-contextmenu').attr('hide-ui', 'wrap');
            } else {
                $('.mfn-builder-area-contextmenu').removeAttr('hide-ui');
            }

        }
    });

    // context menu actions

    $content.find('.mfn-builder-area-contextmenu li a').on('click', function(e) {
        e.preventDefault();
        let action = $(this).data('action');

        if(action == 'delete'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-delete').trigger('click');
        }else if(action == 'edit'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
        }else if(action == 'copy'){
            copypaste.copy(context_el);
        }else if(action == 'paste'){
            let $el = $content.find('.vb-item[data-uid="'+context_el+'"]');
            copypaste.paste($el);
        }else if(action == 'paste-style'){

            if( !mfncopy ) return;

            var copied_el   = mfnvbvars.pagedata.filter( (item) => item.uid == mfncopy )[0];
            var this_el     = mfnvbvars.pagedata.filter( (item) => item.uid == context_el )[0];

            if( copied_el.jsclass != this_el.jsclass ){
                return; // different items
            }

            var listStyles = {};

            for (key in copied_el.attr) {
                if( key.startsWith('style:') || key.includes('_switcher') ) {
                    this_el.attr[key] = JSON.parse( JSON.stringify(copied_el.attr[key]));
                }
            }
            openEditForm.do( $edited_div, false );
            loopAllStyleFields(context_el);
            historyStorage.add();
        }else if(action == 'save-preset'){
            presets.modal( context_el );
        }else if(action == 'convert-global-section'){
            GlobalSections.convertToGlobal( context_el );
        }else if(action == 'reset-style'){
            var this_el = mfnvbvars.pagedata.filter( (item) => item.uid == context_el )[0];

            var listStyles = {};

            listStyles = this_el.attr;

            for(key in listStyles) {
                if(key.startsWith('style:')) {
                    delete listStyles[key];
                }
            }

            $content.find('style.mfn-local-style').remove();
            openEditForm.do( $edited_div, false );
            loopAllStyleFields();

             $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');

            historyStorage.add();
        }else if(action == 'navigator'){

            be_navigator.show(context_el);
        }
        $content.find('.mfn-builder-area-contextmenu').hide();
    });

    $('.mfn-builder-area-contextmenu li a').on('click', function(e) {
        e.preventDefault();
        let action = $(this).data('action');

        if(action == 'delete'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-delete').trigger('click');
        }else if(action == 'edit'){
            $content.find('.vb-item[data-uid="'+context_el+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
        }else if(action == 'copy'){

            copypaste.copy(context_el);
            $content.find('.mfn-builder-area-contextmenu').hide();

        }else if(action == 'paste'){
            $content.find('.mfn-builder-area-contextmenu').hide();
            let $el = $content.find('.vb-item[data-uid="'+context_el+'"]');
            copypaste.paste($el);
        }
        $('.mfn-builder-area-contextmenu').hide();
    });

    // size label +- show
    $builder.on('click', '.mfn-header .mfn-option-btn.mfn-size-label', function(e) {
        if( $content.find('body').hasClass('mfn-modern-nav') ){
            $(this).closest('.mfn-header').toggleClass('mfn-size-change-show');
        }
    });

    // edit on box click
    $builder.on('mouseup', function(e) {
        //e.preventDefault();

        if( preventEdit ) return;

        if(
            $(e.target).closest('.mfn-global-section').length ||
            $(e.target).closest('.mfn-global-wrap').length ||
            $(e.target).closest('.column_placeholder').length ||
            !$(e.target).closest('.vb-item').length ||
            $(e.target).closest('.mfn-wrap-add-item').length ||
            /*$(e.target).closest('.mfn-section-start').length ||*/
            $(e.target).closest('.mcb-section.empty').length ||
            $(e.target).closest('.divider').length ||
            /*$(e.target).closest('.mcb-wrap-inner.empty').length ||*/
            iframe.getSelection().toString() ||
            ( $(e.target).closest('.mfn-header').length && !$(e.target).hasClass('section-header') )
        ) {
            return;
        }

        if( $content.find('body').hasClass('mfn-modern-nav') && !$(e.target).closest('.mfn-header.mfn-element-menu-opened').length ){
            $content.find('.mfn-header.mfn-element-menu-opened').removeClass('mfn-element-menu-opened mfn-size-change-show');
        }

        if( $(e.target).hasClass('mcb-column') ){
            $edited_div = $(e.target).closest('.mcb-wrap');
        }else{
            $edited_div = $(e.target).closest('.vb-item');
        }

        if( !$edited_div.hasClass('mfn-current-editing') ){
            openEditForm.do($edited_div, false);
        }


        // Sidebar adjustments for Globals
        GlobalSections.sectionTriggered = $edited_div;
        GlobalSections.setSidebarClass();
    });

    // edit on icon click
    $builder.on('click', '.mfn-header .mfn-element-edit', function(e) {
        e.preventDefault();
        if( preventEdit ) return;
        if( $(this).closest('.vb-item').hasClass('mfn-current-editing') ) return;
        $edited_div = $(this).closest('.vb-item');



        if( $edited_div.hasClass('mfn-global-section') ) {
            GlobalSections.sectionTriggered = $edited_div;
            $('#header-global-sections').attr('section-id', $edited_div.attr('data-uid'));

            return showGlobals( $edited_div.attr('data-mfn-global') );
        }

        //if( !$edited_div.hasClass('mfn-current-editing') ){
            openEditForm.do($edited_div, false);
        //}
    });

    // dropdown for global sections on new section
    $builder.on('click', '.add-global-sections-button', function(e) {
        const sectionUid = $(this).closest('.mcb-section').attr('data-uid'); // mcb-wrap-uid

        $('#header-global-sections').attr('section-id', sectionUid);
    })

    // dropdown for global sections on new section
    $('.panel-global-sections').on('click', '.mfn-insert-global-section', function(e) {
        e.preventDefault();
        const selected = $(e.target).closest('li').attr('data-id');
        const sectionUid = $('#header-global-sections').attr('section-id');

        $('#header-global-sections').attr(sectionUid);

        $edited_div = $content.find(`.section[data-uid=${sectionUid}]`);

        GlobalSections.fillSectionInfoWithoutCut(sectionUid, selected);
        GlobalSections.getGlobalSection();
    })

    // resize
    $builder.on('click', '.mfn-header .mfn-size-change', function(e) {
        e.preventDefault();

        let item_type = 'mcb-item-';

        let uid = $(this).closest('.vb-item').attr('data-uid');
        edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == uid )[0];
        let type = edited_item.type;

        if( edited_item.jsclass == 'wrap' ) item_type = 'mcb-wrap-';

        let currClass = sizes.filter(size => size.key === edited_item.size)[0];

        if( !edited_item.mobile_size ) edited_item.mobile_size = '1/1';
        if( !edited_item.tablet_size ) edited_item.tablet_size = edited_item.size;

        if(screen == 'tablet'){
            currClass = sizes.filter(size => size.key === edited_item.tablet_size)[0];
        }else if(screen == 'mobile'){
            currClass = sizes.filter(size => size.key === edited_item.mobile_size)[0];
        }

        // reset custom width after change +-
        /*if( $custom_sizeInput.length && $custom_sizeInput.val() != '' ){
            $custom_sizeInput.val('').trigger('change');
            $content.find('.vb-item[data-uid='+uid+'] > div > .mfn-header .mfn-element-size-label').text(currClass.key);
            $('.mfn-vb-'+uid+' .modalbox-card-advanced-'+uid+' .preview-width_switcherinput').val('default').trigger('change');
            return;
        }*/

        let newIndex = currClass.index;

        if( $(this).hasClass('mfn-size-decrease') ){
            newIndex = newIndex - 1 < 1 ? 1 : newIndex - 1;
        }else{
            newIndex = newIndex + 1 > 12 ? 12 : newIndex + 1;
        }

        let newClass = sizes.filter(size => size.index === newIndex)[0];

        if( !items_size[type] || ( items_size[type].length && items_size[type].includes(newClass.key) ) ){

            if($content.find('.vb-item[data-uid='+uid+'] > div > .mfn-header .mfn-element-size-label').length){
                $content.find('.vb-item[data-uid='+uid+'] > div > .mfn-header .mfn-element-size-label').text(newClass.key);
            }

            $content.find('.'+item_type+uid).attr('data-'+screen+'-size', newClass.key);

            if(screen == 'desktop'){
                $content.find('.'+item_type+uid).removeClass(currClass.desktop).addClass(newClass.desktop).attr('data-'+screen+'-col', newClass.desktop);
                edited_item.size = newClass.key;

                if(edited_item.tablet_resized && edited_item.tablet_resized == '0' ) {
                    edited_item.tablet_size = newClass.key;
                    $content.find('.'+item_type+uid).removeClass(currClass.tablet).addClass(newClass.tablet).attr('data-tablet-size', newClass.key);
                }

            }else if(screen == 'tablet'){
                $content.find('.'+item_type+uid).removeClass(currClass.tablet).addClass(newClass.tablet).attr('data-'+screen+'-col', newClass.tablet);
                edited_item.tablet_resized = '1';
                edited_item.tablet_size = newClass.key;
            }else{
                $content.find('.'+item_type+uid).removeClass(currClass.mobile).addClass(newClass.mobile).attr('data-'+screen+'-col', newClass.mobile);
                edited_item.mobile_size = newClass.key;
            }

            if($navigator.find('.navigator-tree li.nav-'+uid+' .navigator-size-label').length){
                $navigator.find('.navigator-tree li.nav-'+uid+' .navigator-size-label').text(newClass.key);
            }

        }

        resetBeforeAfter(uid);

        if($content.find('.'+item_type+uid+' .slick-initialized').length) {
            $content.find('.vb-item[data-uid='+uid+'] .slick-initialized').each(function() {
                $(this).slick('setPosition');
            });
        }

        if($content.find('.'+item_type+uid+' .isotope.mfn-initialized').length){
            $content.find('.'+item_type+uid+' .isotope.mfn-initialized').each(function() {
                var $iso_wrapper = $(this);
                $iso_wrapper.closest('.mcb-column-inner').css('min-height', $iso_wrapper.closest('.mcb-column-inner').outerHeight());
                $iso_wrapper.removeClass('mfn-initialized');
                runAjaxElements();
            });
        }

        if( $content.find('.'+item_type+uid+' .woocommerce-product-gallery').length){
            iframe.window.jQuery('body').trigger('resize');
        }

        reLayoutIsotope( item_type+uid );

        // sticky wrap
        stickyWrap.reset(true);
        historyStorage.add();
    });

    // delete
    $builder.on('click', '.mfn-header .mfn-element-delete', function(e) {
        e.preventDefault();

        let $dom_el = $(this).closest('.vb-item');
        let uid = $dom_el.attr('data-uid');

        $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-delete"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Delete element</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <img class="icon" alt="" src="'+mfnvbvars.themepath+'/muffin-options/svg/warning.svg"> <h3>Delete element?</h3> <p>Please confirm. There is no undo.</p><a class="mfn-btn mfn-btn-red btn-wide btn-modal-confirm" href="#"><span class="btn-wrapper">Delete</span></a> </div></div></div>');

        $('.btn-modal-close').on('click', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();
        });

        $('.btn-modal-confirm').on('click', function(e){
            e.preventDefault();

            mfnvbvars.pagedata = mfnvbvars.pagedata.filter( (item) => item.uid != uid );

            if( $navigator.find('.navigator-tree li.nav-'+uid).length ){
                $navigator.find('.navigator-tree li.nav-'+uid).remove();
            }

            if($dom_el.find('.vb-item').length){
                $dom_el.find('.vb-item').each(function() {
                    let x = $(this).attr('data-uid');
                    mfnvbvars.pagedata = mfnvbvars.pagedata.filter( (item) => item.uid != x );
                });
            }

            //global sections workaround, the class and uid are not the same!
            if($content.find('.mfn-global-section').length ){
                $content.find(`.mcb-section[data-uid=${uid}]`).remove();
            }

            //global wraps workaround, the class and uid are not the same!
            if($content.find('.mfn-global-wrap').length ){
                $content.find(`.mcb-wrap[data-uid=${uid}]`).remove();
            }

            if( $content.find('.mcb-section-'+uid).length ){ $content.find('.mcb-section-'+uid).remove(); }
            if( $content.find('.mcb-wrap-'+uid).length ){ $content.find('.mcb-wrap-'+uid).remove(); checkWrapsCount( $content.find('.mcb-wrap-'+uid).closest('.mcb-section').attr('data-uid') ); }
            if( $content.find('.mcb-item-'+uid).length ){ $content.find('.mcb-item-'+uid).remove(); }

            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();

            iframe.window.jQuery('body').trigger('resize');

            checkEmptyPage();
            checkEmptyWraps()
            checkEmptySections();
            backToWidgets();
            runSorting();

            historyStorage.add();
        });
    });

    // clone section

    $builder.on('click', '.mfn-module-clone', function(e) {
        e.preventDefault();
        stickyWrap.reset();
        let $el = $(this).closest('.vb-item');
        if( builder_type == 'header' && $el.hasClass('mcb-wrap') && $(this).closest('.mfn-new-wraps-disabled').length ) return;
        copypaste.copy( $el.attr('data-uid'), $el );
    });

    // add wrap

    $builder.on('click', '.mfn-wrap-add', function(e) {
        e.preventDefault();
        let thisid = $(this).closest('.mcb-section').attr('data-uid');
        let is_divider = 0;
        if($(this).hasClass('mfn-divider-add')){ is_divider = 1; }
        addNewWrap(thisid, is_divider);
    });

    inlineEditor();

    if( $content.find('.section_video .mfn-vb-video-lazy').length ){
        $content.find('.section_video .mfn-vb-video-lazy').each(function() {
            $(this).replaceWith( $(this).html().replace('<!--', '').replace('-->', '') );
        })
    }

    runSorting();
    loopAllStyleFields();
}

$editpanel.on('click', '.sidebar-panel-footer .btn-save-option', function(e) {
    e.preventDefault();
    if (mfnvbvars.view == 'demo') return;

    $(this).parent().toggleClass('s-opt-show');
    $editpanel.bind('click', closeSaveOpt);
    $content.bind('click', closeSaveOpt);
});

$editpanel.on('click', '.btn-save-changes', function(e){
    e.preventDefault();

    if( mfnvbvars.view == 'demo' ) return;

    var $list = $(".panel.panel-revisions-update ul.revisions-list");
    var formaction = $(this).attr('data-action');
    var isSectionWrapEditor = $('body').hasClass('mfn-template-section') || $('body').hasClass('mfn-template-wrap');

    if( $('.modal-display-conditions').length && !$('.modal-display-conditions').hasClass('show') && ( builder_type == 'popup' || builder_type == 'header' || builder_type == 'shop-archive' || builder_type == 'single-product' || builder_type == 'footer' ) ){
        // if template conditions
        $('.modal-display-conditions .btn-save-changes').attr('data-action', formaction);
        $('.modal-display-conditions').addClass('show');
        return;
    }else if(!$(this).hasClass('loading disabled')){
        $(this).addClass('loading disabled');

        var formData = prepareForm();

        var datas = {
            'mfn-builder-nonce': wpnonce,
            'action': 'updatevbview',
            'pageid': pageid,
            'savetype': formaction,
            'sections': formData,
        };

        // attach template conditions
        if( $('.modal-display-conditions').length && $('.modal-display-conditions').hasClass('show') ){
            let conditions = $(document.forms['tmpl-conditions-form']).serializeArray();
            for (var i=0; i<conditions.length; i++)
                datas[ conditions[i].name ] = conditions[i].value;
        }

        $.ajax({
            url: mfnajaxurl,
            data: datas,
            type: 'POST',
            success: function(response){
                if(response){ displayRevisions(response, $list); }
                window.onbeforeunload = null;

                $('.btn-save-changes').removeClass('loading disabled');
                datas = {};

                if(formaction == 'publish'){
                    $('.btn-save-form-primary').attr('data-action', 'update');
                    $('.btn-save-form-primary span').text('Update');

                    savebutton = 'Update';
                    formaction = 'update';

                    $('.btn-save-form-secondary').attr('data-action', 'draft');
                    $('.btn-save-form-secondary span').text('Save as draft');
                }else if(formaction == 'draft'){
                    $('.btn-save-form-primary').attr('data-action', 'publish');
                    $('.btn-save-form-primary span').text('Publish');

                    savebutton = 'Publish';
                    formaction = 'publish';

                    $('.btn-save-form-secondary').attr('data-action', 'update');
                    $('.btn-save-form-secondary span').text('Save draft');
                }

                if( $('.modal-display-conditions').length ){
                    $('.modal-display-conditions .btn-modal-save').removeClass('loading disabled');
                    $('.modal-display-conditions').removeClass('show');
                }

                if( settings.forceReload ){
                    settings.continue();
                }

                $('#mfn-preview-wrapper').append('<div style="display: none;" class="mfn-snackbar"><span class="mfn-icon mfn-icon-information"></span><div class="snackbar-message">Page updated.</div><div class="snackbar-action"><a href="'+$('.menu-viewpage').attr('href')+'" target="_blank">View page</a></div></div>');
                $('.mfn-snackbar').fadeIn();
                closeSnackbar();
            }
        });

    }
});


var prepareForm2 = {

    formData: [],

    get: function( uid = false ){

        // prepareForm2.get()

        prepareForm2.formData = [];

        var $wrapper = $builder.find('.mcb-section.vb-item');

        if( uid ){
            $wrapper = $builder.find('.vb-item[data-uid="'+uid+'"]');
        }

        $wrapper.each(function() {
            var vb_uid = $(this).attr('data-uid');
            var this_vb = mfnvbvars.pagedata.filter( (item) => item.uid === vb_uid )[0];

            if( typeof this_vb['attr'] !== 'undefined' ) {
                this_vb['attr']['vb'] = 1;
                this_vb['attr']['rwd'] = screen;
                this_vb['attr']['vb_postid'] = $(this).closest('.mfn-queryloop-item-wrapper').length ? $(this).closest('.mfn-queryloop-item-wrapper').attr('data-post') : pageid;
            }else if( typeof this_vb['attr'] !== 'undefined' ) {
                this_vb['attr']['rwd'] = screen;
            }

            if( this_vb && typeof this_vb.uid !== 'undefined' ){

                if( $(this).find('.wrap.vb-item').length ){
                    this_vb.wraps = [];
                    this_vb.wraps = prepareForm2.wraps($(this));
                }else{
                    this_vb.items = [];
                    this_vb.items = prepareForm2.items($(this));
                }

                prepareForm2.formData.push( this_vb );
            }
        });

        return prepareForm2.formData;
    },

    wraps: function($wrapper) {

        var wraps = [];

        $wrapper.find( '.wrap.vb-item' ).each(function() {
            var wrap_uid = $(this).attr('data-uid');
            var this_wrap = mfnvbvars.pagedata.filter( (item) => item.uid === wrap_uid )[0];
            if( this_wrap && !wraps.filter( (item) => item.uid === wrap_uid ).length ){

                this_wrap.items = [];
                this_wrap.items = prepareForm2.items($(this));

                wraps.push( this_wrap );
            }

        });

        return wraps;

    },

    items: function($wrapper) {
        var items = [];
        var used_fonts = [];

        $wrapper.find( '.vb-item.mcb-column' ).each(function() {

            var col_uid = $(this).attr('data-uid');
            var this_col = mfnvbvars.pagedata.filter( (item) => item.uid === col_uid )[0];

            if( !items.filter( (item) => item.uid === col_uid ).length ){

                if( this_col && typeof this_col.attr !== 'undefined' && typeof this_col.attr.content !== 'undefined' ){
                    var inline_editor = $.parseHTML( this_col.attr.content );

                    $.each( inline_editor, function( i, el ) {
                      if( $(el).find('span[data-font-family]').length ) {
                        $(el).find('span[data-font-family]').each(function() {
                            used_fonts.push( $(this).attr('data-font-family') );
                        });
                      }
                    });

                    this_col.attr['used_fonts'] = used_fonts.join(',');
                }

                if( typeof this_col['attr'] !== 'undefined' ) {
                    this_col['attr']['vb'] = 1;
                    this_col['attr']['rwd'] = screen;
                    this_col['attr']['vb_postid'] = $(this).closest('.mfn-queryloop-item-wrapper').length ? $(this).closest('.mfn-queryloop-item-wrapper').attr('data-post') : pageid;
                }

                items.push(this_col);

            }

        });

        return items;
    }
};

function prepareForm( uid = false ){
    var formData = [];

    var $wrapper = $builder.find('.mcb-section.vb-item');

    if( uid ){
        $wrapper = $builder.find('.vb-item[data-uid="'+uid+'"]');
    }

    var used_fonts = [];

    $wrapper.each(function() {
        var sec_uid = $(this).attr('data-uid');
        var this_section = mfnvbvars.pagedata.filter( (item) => item.uid === sec_uid )[0];
        if( this_section && typeof this_section.uid !== 'undefined' ){
            if( typeof this_section['attr'] !== 'undefined' && typeof this_section['attr']['rwd'] !== 'undefined' ) delete this_section['attr']['rwd'];
            this_section.wraps = [];
            $(this).find( '.mcb-wrap.vb-item' ).each(function() {
                var wrap_uid = $(this).attr('data-uid');
                var this_wrap = mfnvbvars.pagedata.filter( (item) => item.uid === wrap_uid )[0];
                if( this_wrap && !this_section.wraps.filter( (item) => item.uid === wrap_uid ).length ){
                    this_wrap.items = [];
                    $(this).find( '.mcb-column.vb-item' ).each(function() {
                        var col_uid = $(this).attr('data-uid');
                        var this_col = mfnvbvars.pagedata.filter( (item) => item.uid === col_uid )[0];

                        if( this_col && !this_wrap.items.filter( (item) => item.uid === col_uid ).length ){

                            if( typeof this_col['attr'] !== 'undefined' && typeof this_col['attr']['vb'] !== 'undefined' ) delete this_col['attr']['vb'];
                            if( typeof this_col['attr'] !== 'undefined' && typeof this_col['attr']['rwd'] !== 'undefined' ) delete this_col['attr']['rwd'];
                            if( typeof this_col['attr'] !== 'undefined' && typeof this_col['attr']['vb_postid'] !== 'undefined' ) delete this_col['attr']['vb_postid'];

                            if( this_col && typeof this_col.attr !== 'undefined' && typeof this_col.attr.content !== 'undefined' ){

                                var inline_editor = $.parseHTML( this_col.attr.content );

                                $.each( inline_editor, function( i, el ) {
                                  if( $(el).find('span[data-font-family]').length ){
                                    $(el).find('span[data-font-family]').each(function() {
                                        used_fonts.push( $(this).attr('data-font-family') );
                                    });
                                  }
                                });

                                this_col.attr['used_fonts'] = used_fonts.join(',');
                            }

                            this_wrap.items.push(this_col);

                        }
                    });

                    this_section.wraps.push( this_wrap );
                }

            });
            formData.push( this_section );
        }
    });
    return JSON.stringify(formData);
}

function closeSnackbar(){
    setTimeout(function() {
        $('.mfn-snackbar').fadeOut(function() {
            $('.mfn-snackbar').remove();
        });
    }, 5000);
}

function closeSaveOpt(e) {
    var container = $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-footer .btn-save-action');

    if (!container.is(e.target) && container.has(e.target).length === 0){
        container.removeClass('s-opt-show');
        $(document).unbind('click', closeSaveOpt);
        $content.unbind('click', closeSaveOpt);
    }

}

// update wraps count

function checkWrapsCount(uid = false){

    if( builder_type != 'header' ) return;

    var $items = $content.find('.vb-item.mcb-section');
    if( uid ) $items = $content.find('.vb-item.mcb-section.mcb-section-'+uid);

    if( $items.length ){
        $items.each(function() {
            var wrapscount = $(this).find('.mcb-wrap').length;
            if( wrapscount >= 3 ){
                $(this).addClass('mfn-new-wraps-disabled');
            }else{
                $(this).removeClass('mfn-new-wraps-disabled');
            }
        });
    }
}

// check Empty Page

function checkEmptyPage(){
    if( !$builder.find('.vb-item.mcb-section.mfn-'+elements_ver+'-section').not('.hide-'+screen).length ){
        if(!$builder.find('.mfn-section-start').length){
            $content.find('body').addClass('mfn-ui-empty-page');
            $builder.prepend('<div class="mfn-section-start"><a href="#" class="mfn-section-add"><svg class="welcome-pic" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.84 51.84"><defs><style>.cls-1{fill:none;stroke-width:1.5px;}.cls-1,.cls-3{stroke:#304050;stroke-miterlimit:10;}.cls-2,.cls-3{fill:#304050;}.cls-2{fill-rule:evenodd;}.cls-3{stroke-width:0.7px;}</style></defs><polyline class="cls-1" points="24.92 12.92 24.92 29.38 28.92 29.38"/><line class="cls-1" x1="24.92" y1="29.38" x2="24.92" y2="45.84"/><polyline class="cls-1" points="45.35 16.92 45.35 12.92 4.49 12.92 4.49 45.84 45.35 45.84 45.35 39.11"/><polyline class="cls-1" points="47.32 33.38 49.35 33.38 49.35 16.92 28.92 16.92 28.92 33.38 35.83 33.38"/><polyline class="cls-1" points="4.49 12.92 4.49 6 45.35 6 45.35 12.92"/><path class="cls-2" d="M39.41,9.41a1.24,1.24,0,1,0-1.24,1.22A1.23,1.23,0,0,0,39.41,9.41Z"/><path class="cls-2" d="M43,9.41a1.24,1.24,0,1,0-1.24,1.22A1.24,1.24,0,0,0,43,9.41Z"/><path class="cls-2" d="M35.83,9.41a1.24,1.24,0,1,0-1.24,1.22A1.24,1.24,0,0,0,35.83,9.41Z"/><path class="cls-2" d="M9.18,9.41a1.25,1.25,0,1,0-1.25,1.22A1.24,1.24,0,0,0,9.18,9.41Z"/><path class="cls-3" d="M46,29.7h0a1.3,1.3,0,0,0-.86.33,1.33,1.33,0,0,0-1.24-.91,1.32,1.32,0,0,0-.91.4,1.33,1.33,0,0,0-1.18-.75h0A1.16,1.16,0,0,0,41,29V25.83a1.33,1.33,0,1,0-2.65,0v6.32L38,31.72a1.77,1.77,0,0,0-2.6-.2l-.31.26a.27.27,0,0,0-.07.34l3,5.82a3.11,3.11,0,0,0,2.74,1.72h3.41a3.25,3.25,0,0,0,3.14-3.34V34.38c0-1.33,0-1.82,0-3.29A1.35,1.35,0,0,0,46,29.7Zm.77,4.68v1.94a2.71,2.71,0,0,1-2.59,2.79h-3.4a2.56,2.56,0,0,1-2.25-1.43l-2.93-5.62.15-.12h0a1.25,1.25,0,0,1,.92-.33,1.29,1.29,0,0,1,.89.47l.84,1a.29.29,0,0,0,.31.09.28.28,0,0,0,.18-.26v-7.1a.78.78,0,1,1,1.55,0V32A.28.28,0,1,0,41,32V30.12a.78.78,0,0,1,.76-.8h0a.81.81,0,0,1,.78.84v1.67a.28.28,0,1,0,.55,0V30.52a.76.76,0,1,1,1.52,0v1.23a.28.28,0,1,0,.56,0v-.67a.81.81,0,0,1,.78-.83h0a.81.81,0,0,1,.77.84Z"/></svg></a><h2>Welcome to BeBuilder</h2> <a class="mfn-btn mfn-btn-green btn-icon-left btn-large mfn-section-add" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Start creating</span></a> <p><a class="view-tutorial" href="#">View tutorial</a></p></div>');
            $content.find('.view-tutorial').on('click', function(e) {
                e.preventDefault();
                introduction.reopen();
            });
        }
    }else{
        removeStartBuilding();
    }
}

// check empty wraps

function checkEmptyWraps(){
    $builder.find('.vb-item.mcb-wrap:not(.divider) .mcb-wrap-inner').each(function(i) {
        if( !$(this).find('.mcb-column').length ){
            if( !$(this).hasClass('empty') ) $(this).addClass('empty');
            // if( $(this).find('') )
            if( !$(this).find('.mfn-drag-helper').length ) $(this).append('<div class="mfn-drag-helper placeholder-wrap"></div>');
            $(this).append('<div class="mfn-wrap-new"><a href="#" class="mfn-item-add mfn-btn btn-icon-left btn-small mfn-btn-blank2"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span>Add element</span></a></div>');
        }else if( $(this).find('.mcb-column').length && $(this).find('.mfn-wrap-new').length ){
            $(this).removeClass('empty');
            $(this).parent('.mcb-wrap').removeClass('mcb-wrap-new');
            $(this).find('.mfn-wrap-new').remove();
        }
    });
    runSorting();
}


// check empty sections

function checkEmptySections(){
    $builder.find('.vb-item.mcb-section').each(function(i) {
        if(!$(this).find('.mcb-wrap').length){
            $(this).addClass('empty')

            let global_sections_html = '<a class="mfn-btn add-global-sections-button mfn-btn-green btn-icon-left" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Global sections</span></a>';

            $(this).find('.section_wrapper').html('<div class="mfn-section-new"><h5>Select a wrap layout</h5> <div class="wrap-layouts"> <div class="wrap-layout wrap-11" data-type="wrap-11" data-tooltip="1/1"></div><div class="wrap-layout wrap-12" data-type="wrap-12" data-tooltip="1/2 | 1/2"><span></span></div><div class="wrap-layout wrap-13" data-type="wrap-13" data-tooltip="1/3 | 1/3 | 1/3"><span></span><span></span></div><div class="wrap-layout wrap-14" data-type="wrap-14" data-tooltip="1/4 | 1/4 | 1/4 | 1/4"><span></span><span></span><span></span></div><div class="wrap-layout wrap-13-23" data-type="wrap-1323" data-tooltip="1/3 | 2/3"><span></span></div><div class="wrap-layout wrap-23-13" data-type="wrap-2313" data-tooltip="2/3 | 1/3"><span></span></div><div class="wrap-layout wrap-14-12-14" data-type="wrap-141214" data-tooltip="1/4 | 1/2 | 1/4"><span></span><span></span></div></div><p>or choose from</p><a class="mfn-btn prebuilt-button mfn-btn-green btn-icon-left" href="#"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add-light"></span>Pre-built sections</span></a> '+ global_sections_html +' </div>');

        }else if( $(this).find('.mfn-section-new').length ){
            $(this).find('.mfn-section-new').remove();
            $(this).removeClass('empty');
        }
    });
}

// add Wrap

function addNewWrap(id, is_divider) {

    if(!$builder.find('.mfn-wrap-add').hasClass('loading')){

        var new_size = '1/1';
        if( is_divider ) new_size = 'divider';

        var new_element = elements.wrap(new_size);

        $builder.find('.mfn-wrap-add').addClass('loading');

        if($builder.find('.mcb-section-'+id+' .section_wrapper').length == 0){
            $builder.find('.mcb-section-'+id).append('<div class="section_wrapper mcb-section-inner"></div>');
        }

        $builder.find('.mcb-section-'+id+' .section_wrapper .vb-item.mcb-wrap').last().after( new_element.html );

        checkWrapsCount(id);

        $content.find('.mfn-wrap-add').removeClass('loading');

        backToWidgets();
        checkEmptySections();
        blink();

        runSorting();

        if($('body').hasClass('mfn-navigator-active')) be_navigator.show(new_uid);

        loopAllStyleFields(new_element.uid);

    }
}

// add new widget
function addNewWidget(item){
    var new_element = false;
    var new_script = false;

    var get_new_element = elements.item(item);

    if( Array.isArray(get_new_element) ){
        new_element = get_new_element[0];
        new_script = get_new_element[1];
    }else{
        new_element = get_new_element;
    }

    get_new_element = false;

    if( !new_element ) return;

    var new_uid = $(new_element).attr('data-uid');

    //var navigator_html = navigatorHtml(item, new_uid, '1/1');

    //delete new_element.html;

    if($builder.find('.mcb-wrap-'+new_widget_container).hasClass('mcb-wrap-new')){
        $builder.find('.mcb-wrap-'+new_widget_container).removeClass('mcb-wrap-new');
    }

    if($builder.find('.mcb-item-'+new_widget_container).length){

        if(new_widget_position == 'before'){
            $builder.find('.mcb-item-'+new_widget_container).before(new_element);
            //$navigator.find('.navigator-tree .nav-'+new_widget_container).before(navigator_html);
        }else{
            $builder.find('.mcb-item-'+new_widget_container).after(new_element);
            //$navigator.find('.navigator-tree .nav-'+new_widget_container).after(navigator_html);
        }

    }else{

        $builder.find('.mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').append(new_element);

        if($builder.find('.mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').length && $builder.find('.mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').hasClass('empty')){
            $builder.find('.mcb-wrap-'+new_widget_container+' .mcb-wrap-inner').removeClass('empty');
            $builder.find('.mcb-wrap-'+new_widget_container+' .mcb-wrap-inner .mfn-wrap-new').remove();
        }

        /*if( !$navigator.find('.navigator-tree .nav-'+new_widget_container+' ul').length ){
            $navigator.find('.navigator-tree .nav-'+new_widget_container).append('<ul class="mfn-sub-nav">'+navigator_html+'</ul>');
        }else{
            if(new_widget_position == 'before') {
                $navigator.find('.navigator-tree .nav-'+new_widget_container+' > ul').prepend(navigator_html);
            }else{
                $navigator.find('.navigator-tree .nav-'+new_widget_container+' > ul').append(navigator_html);
            }
        }*/
    }

    setTimeout(function() {

        if( $builder.find('.vb-item.mcb-wrap-'+new_widget_container).closest('.mfn-looped-items').length ){
            re_render( $builder.find('.vb-item.mcb-wrap-'+new_widget_container).closest('.mfn-looped-items').attr('data-uid') );
        }

        if( $builder.find('.vb-item.mcb-wrap-'+new_widget_container+'.mfn-looped-items').length ){
            re_render( $builder.find('.vb-item.mcb-wrap-'+new_widget_container+'.mfn-looped-items').attr('data-uid') );
        }

        if( $builder.find('.vb-item.mcb-item-'+new_widget_container).closest('.mfn-looped-items').length ){
            re_render( $builder.find('.vb-item.mcb-item-'+new_widget_container).closest('.mfn-looped-items').attr('data-uid') );
        }

    }, 300);

    if(new_script) {
        var ajax_script = document.createElement("script");
        ajax_script.innerHTML = new_script;
        document.getElementById('mfn-vb-ifr').contentWindow.document.body.appendChild(ajax_script);
    }

    if(item == 'progress_bars'){ $builder.find('.mcb-wrap-inner .mcb-item-'+new_uid+' .bars_list').addClass('hover'); }

    inlineEditor();
    checkEmptyWraps();

    runAjaxElements();

    loopAllStyleFields(new_uid);
    runSorting();

    if($('body').hasClass('mfn-navigator-active')) be_navigator.show(new_uid);

    blink();
}

function navigatorHtml(type, uid, size = false) {
    if( type == 'Section' ){
        $html = '<li class="navigator-section nav-'+uid+'"><a data-uid="'+uid+'" href="#" class="">'+type;

        if( size && size == 'Global' ){
            $html += '<span class="navigator-section-id">Global</span>';
        }else if( size && size !== '' ){
            $html += '<span class="navigator-section-id">#'+size+'</span>';
        }

        $html += '</a>';

        if( !size || size != 'Global' ) $html += '<span class="navigator-arrow"><i class="icon-down-open-big"></i></span>';

        $html += '</li>';
    }else if( type == 'Wrap'){
        $html = '<li class="navigator-wrap nav-'+uid+'"><a data-uid="'+uid+'" href="#">'+type+' <span class="navigator-size-label">'+size+'</span></a><span class="navigator-arrow"><i class="icon-down-open-big"></i></span></li>';
    }else{
        $html = '<li data-name="'+type.replace('_', '-')+'" class="navigator-item nav-'+uid+' navitemtype"><a data-uid="'+uid+'" href="#"><span class="mfn-icon mfn-icon-'+type.replace('_', '-')+'"></span>'+type.replace('_', ' ')+'</a></li>';
    }
    return $html;
}


function removeStartBuilding(){
    if($builder.find('.mfn-section-start').length){
        $content.find('body').removeClass('mfn-ui-empty-page');
        $builder.find('.mfn-section-start').remove();
    }
}

// shortcode remove icon

$('.modal-add-shortcode .browse-icon .mfn-button-delete').on('click', function(e) {
    e.preventDefault();
    $('.modal-add-shortcode.show .browse-icon .mfn-form-control').val(sample_icon).trigger('change');
    $('.modal-add-shortcode.show .form-addon-prepend .mfn-button-upload .label i').attr('class', sample_icon);
});

// choose icon
$('.mfn-modal.modal-select-icon .mfn-items-list li a').on('click', function(e) {
    e.preventDefault();

    let icon = $(this).find('i').attr('class');
    $(this).parent().addClass('active');

    if( $('.modal-add-shortcode').hasClass('show') ) {
        // for shortcode
        $('.modal-add-shortcode.show .browse-icon .mfn-form-control').val(icon).trigger('change');
        $('.modal-add-shortcode.show .browse-icon.has-addons-prepend').removeClass('empty');
        $('.modal-add-shortcode.show .browse-icon .form-addon-prepend .mfn-button-upload .label i').attr('class', icon);
        $('.modal-select-icon.show').removeClass('show');
    }else{
        // for sidebar
        var $input = $('.sidebar-panel-content .mfn-form-row .browse-icon.current-icon-editing .mfn-field-value, .sidebar-panel-content .mfn-form-row .browse-icon.current-icon-editing .field-to-object');
        $input.val(icon).trigger('change');
        $('.sidebar-panel-content .mfn-form-row .browse-icon.current-icon-editing').removeClass('empty current-icon-editing');
        $('.mfn-modal').removeClass('show');
    }
});

// delete icon
$editpanel.on('click', '.browse-icon .mfn-button-delete', function(e) {
    e.preventDefault();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');

    $editbox = $(this).closest('.form-control');
    $('.mfn-field-value,.mfn-tab-icon', $editbox).val('').trigger('change');

});


$editpanel.on('change', '.mfn-form-row .browse-icon .mfn-field-value, .mfn-form-row .browse-icon .field-to-object', function() {
    var $input = $(this);
    var $editrow = $(this).closest('.mfn-form-row');
    let it;

    if( $(this).closest('.mfn-element-fields-wrapper').length ){
        it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    }

    let icon = $(this).val();

    if( icon != '' ){

        $(this).closest('.mfn-form-row').find('.form-addon-prepend .mfn-button-upload .label i').attr('class', icon);
        $(this).closest('.mfn-form-row').find('.browse-icon').removeClass('empty');

        // console.log('# icon change');

        if( isBlocks() ){
          $content.find('.'+it+' .item-preview-icon i').attr('class',icon).removeClass('empty');
        } else if($content.find('.'+it).hasClass('column_counter')){
            // counter
            if( $content.find('.'+it+' .icon_wrapper').length ){
                if($content.find('.'+it+' .icon_wrapper i').length){
                    $content.find('.'+it+' .icon_wrapper i').attr('class', icon);
                }else{
                    $content.find('.'+it+' .icon_wrapper').html('<i class="'+icon+'"></i>');
                }
            }else{
                $content.find('.'+it+' .counter').prepend('<div class="icon_wrapper"><i class="'+icon+'"></i></div>');
            }
        }else if($content.find('.'+it).hasClass('column_flat_box')){
            // flat box
            if($content.find('.'+it+' .icon i').length){
                $content.find('.'+it+' .icon i').attr('class', icon);
            }else{
                $content.find('.'+it+' .icon').html('<i class="'+icon+'"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_icon_box')){
            // icon box
            if($content.find('.'+it+' .icon_wrapper .icon i').length){
                $content.find('.'+it+' .icon_wrapper .icon i').attr('class', icon);
            }else{
                if($content.find('.'+it+' .icon_box .image_wrapper').length){ $content.find('.'+it+' .icon_box .image_wrapper').remove(); }
                $content.find('.'+it+' .icon_box').prepend('<div class="icon_wrapper"><div class="icon"><i class="'+icon+'"></i></div></div>');
            }
        }else if($content.find('.'+it).hasClass('column_list')){
            // list
            if($content.find('.'+it+' .list_left i').length){
                $content.find('.'+it+' .list_left i').attr('class', icon);
            }else{
                $content.find('.'+it+' .list_left').removeClass('list_image').addClass('list_icon').html('<i class="'+icon+'"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_fancy_heading')){
            // fancy heading
            if($content.find('.'+it+' .icon_top i').length){
                $content.find('.'+it+' .icon_top i').attr('class', icon);
            }else{
                $content.find('.'+it+' .fh-top').html('<div class="icon_top"><i class="'+icon+'"></i></div>');
            }
        }else if($content.find('.'+it).hasClass('column_call_to_action')){
            // call to action
            if($content.find('.'+it+' .call_center i').length){
                $content.find('.'+it+' .call_center i').attr('class', icon);
            }else{
                $content.find('.'+it+' .call_center').html('<i class="'+icon+'"></i>');
            }
            if( $content.find('.'+it+' .call_center .button').length ){
                $content.find('.'+it+' .call_center .button').addClass('has-icon');
            }
        }else if($content.find('.'+it).hasClass('column_button')){
            // button
            if($content.find('.'+it+' .button .button_icon i').length){
                $content.find('.'+it+' .button .button_icon i').attr('class', icon);
            }else{
                $content.find('.'+it+' .button').prepend('<span class="button_icon"><i class="'+icon+'"></i></span>');
                $content.find('.'+it+' .button').addClass('has-icon');
            }
        }else if($content.find('.'+it).hasClass('column_chart')){
            // chart
            if($content.find('.'+it+' .chart .icon i').length){
                $content.find('.'+it+' .chart .icon i').attr('class', icon);
            }else{
                if( !$content.find('.'+it+' .chart > .image').length ){
                    $content.find('.'+it+' .chart > .image').remove();
                    $content.find('.'+it+' .chart > .num').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="icon"><i class="'+icon+'"></i></div>');
                }else{
                    $content.find('.'+it+' .chart').append('<span class="mfn_tmp_info">The picture has higher priority. Delete it to see icon.</span>');
                    setTimeout(function() {
                        $content.find('.mfn_tmp_info').remove();
                    }, 3000);
                }

            }
        }else if($content.find('.'+it).hasClass('column_header_icon')){
            // header icon
            $content.find('.'+it+' .icon-wrapper i').remove();
            $content.find('.'+it+' .icon-wrapper img').remove();
            $content.find('.'+it+' .icon-wrapper svg').remove();
            if($content.find('.'+it+' .icon-wrapper').length){
                $content.find('.'+it+' .icon-wrapper').prepend('<i class="'+icon+'"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_accordion')){
            // accordion icon
            if( $input.hasClass('preview-icon_activeinput') ){
                $content.find('.'+it+' .accordion .question .title .acc-icon-minus').attr('class', 'acc-icon-minus '+icon);
            }else{
                $content.find('.'+it+' .accordion .question .title .acc-icon-plus').attr('class', 'acc-icon-plus '+icon);
            }
        }else if($content.find('.'+it).hasClass('column_blockquote')){
            // blockquote icon
            if( $editrow.hasClass('icon_author') ){
                $content.find('.'+it+' .blockquote .author i').attr('class', icon);
            }else{
                $content.find('.'+it+' .blockquote .mfn-blockquote-icon i').attr('class', icon);
            }
        }else if($content.find('.'+it).hasClass('column_icon_box_2')){
            // icon box 2
            if($content.find('.'+it+' .icon-wrapper').length){
                $content.find('.'+it+' .icon-wrapper').html('<i class="'+icon+'" aria-hidden="true"></i>');
            }else{
                $content.find('.'+it+' .desc-wrapper').before('<div class="icon-wrapper"><i class="'+icon+'" aria-hidden="true"></i></div>');
            }
        }else if($content.find('.'+it).hasClass('column_header_menu') && $editrow.hasClass('header_menu') && $editrow.hasClass('submenu_icon') ){
            // header menu submenu icon
            if($content.find('.'+it+' .menu-sub').length){
                $content.find('.'+it+' .menu-sub').html('<i class="'+icon+'" aria-hidden="true"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_sidemenu_menu') && $editrow.hasClass('sidemenu_menu') && $editrow.hasClass('submenu_icon') ){
            // header menu submenu icon
            if($content.find('.'+it+' .outer-menu-sub').length){
                $content.find('.'+it+' .outer-menu-sub').html('<i class="'+icon+'" aria-hidden="true"></i>');
            }
        }else if($content.find('.'+it).hasClass('column_header_search')){
            // header search icon
            if($content.find('.'+it+' .icon_search').length){
                $content.find('.'+it+' .icon_search').replaceWith('<span class="icon_search"><i class="'+icon+'" aria-hidden="true"></i></span>');
            }else{
                $content.find('.'+it+' form#searchform').prepend('<span class="icon_search"><i class="'+icon+'" aria-hidden="true"></i></span>');
            }
        }else if($content.find('.'+it).hasClass('column_megamenu_menu') && $editrow.hasClass('megamenu_menu submenu_icon') ){
            // megamenu submenu icon
            if($content.find('.'+it+' .menu-sub').length){
                $content.find('.'+it+' .menu-sub i').attr('class', icon);
            }else{
                $content.find('.'+it+' li.menu-item-has-children > a').append('<span class="menu-sub"><i class="'+icon+'" aria-hidden="true"></i></span>');
            }
        }else if($content.find('.'+it).hasClass('column_megamenu_menu') && $editrow.hasClass('megamenu_menu decoration_icon') ){
            // megamenu decoration icon
            if($content.find('.'+it+' .decoration-icon').length){
                $content.find('.'+it+' .decoration-icon i').attr('class', icon);
            }else{
                $content.find('.'+it+' li:not(.menu-item-has-children) > a').append('<span class="decoration-icon"><i class="'+icon+'" aria-hidden="true"></i></span>');
            }
        }else if($content.find('.'+it).hasClass('column_header_burger') && $editrow.hasClass('icon')){
            // header menu burger
            if($content.find('.'+it+' .icon-wrapper').length){
                $content.find('.'+it+' .icon-wrapper img').remove();
                $content.find('.'+it+' .icon-wrapper i').remove();
                $content.find('.'+it+' .icon-wrapper svg').remove();
                $content.find('.'+it+' .icon-wrapper').html('<i class="'+icon+'" aria-hidden="true"></i>');
            }else{
                $content.find('.'+it+' .mfn-icon-box').prepend('<div class="icon-wrapper"><i class="'+icon+'" aria-hidden="true"></i></div>');
            }
        }else if( $editrow.hasClass('query_display_slider_arrow_prev') ){
            $content.find('.'+it+' .swiper-button-prev i').attr('class', icon);
        }else if( $editrow.hasClass('query_display_slider_arrow_next') ){
            $content.find('.'+it+' .swiper-button-next i').attr('class', icon);
        }else if($content.find('.'+it).hasClass('column_popup_exit') && $editrow.hasClass('popup_exit icon') ){
            // exit popup close popup icon
            if($content.find('.'+it+' .button_icon').length){
                if( !$content.find('.'+it+' .button_icon img').length ) $content.find('.'+it+' .button_icon').html('<i class="'+icon+'"></i>');
            }else{
                $content.find('.'+it+' .exit-mfn-popup').addClass('has-icon');
                $content.find('.'+it+' .exit-mfn-popup').prepend('<span class="button_icon"><i class="'+icon+'"></i></span>');
            }
        }
    }else{

        $(this).closest('.mfn-form-row').find('.form-addon-prepend .mfn-button-upload .label i').attr('class', sample_icon);
        $(this).closest('.mfn-form-row').find('.mfn-field-value').val('');
        $(this).closest('.mfn-form-row').find('.browse-icon').addClass('empty');

        // console.log('# preview icon');

        if( isBlocks() ){
          $content.find('.'+it+' .item-preview-icon i').removeAttr('class');
        } else if($content.find('.'+it).hasClass('column_counter')){
            // counter
            if($('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val().length){
                $content.find('.'+it+' .icon_wrapper').html( $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val() );
            }else{
                $content.find('.'+it+' .icon_wrapper').remove();
            }
        }else if($content.find('.'+it).hasClass('column_flat_box')){
            // flat box
            if($content.find('.'+it+' .icon i').length){
                $content.find('.'+it+' .icon i').attr('class', sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_icon_box')){
            // icon box
            $content.find('.'+it+' .icon_wrapper').remove();
            if( $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val().length ){
                $content.find('.'+it+' .icon_box').prepend(' <div class="image_wrapper"><img src=" '+ $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-imageinput').val() +' " class="scale-with-grid" alt=""></div> ');
            }else{
                 $content.find('.'+it+' .icon_wrapper .icon i').attr('class', sample_icon);
                 //$('.panel-edit-item .mfn-form-row.icon .preview-iconinput').val(sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_list')){
            // list
            if($content.find('.'+it+' .list_left i').length){
                $content.find('.'+it+' .list_left i').attr('class', sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_fancy_heading')){
            // fancy heading
            if($content.find('.'+it+' .icon_top i').length){
                $content.find('.'+it+' .icon_top i').attr('class', sample_icon);
            }
        }else if($content.find('.'+it).hasClass('column_call_to_action')){
            // call to action
            if($content.find('.'+it+' .call_center i').length){
                $content.find('.'+it+' .call_center i').attr('class', '');
            }
            if( $content.find('.'+it+' .call_center .button').length ){
                $content.find('.'+it+' .call_center .button').removeClass('has-icon');
                $content.find('.'+it+' .call_center .button .button_icon').remove();
            }
        }else if($content.find('.'+it).hasClass('column_button')){
            // button
            if($content.find('.'+it+' .button .button_icon i').length){
                $content.find('.'+it+' .button .button_icon').remove();
                $content.find('.'+it+' .button').removeClass('has-icon');
            }
        }else if($content.find('.'+it).hasClass('column_chart')){
            // chart
            if($content.find('.'+it+' .chart .icon').length){
                $content.find('.'+it+' .chart .icon').remove();

                if( $('.panel-edit-item .mfn-form .preview-imageinput').val().length ){
                    $content.find('.'+it+' .chart .num').remove();
                    $content.find('.'+it+' .chart .icon').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="image"><img class="scale-with-grid" src="'+$('.panel-edit-item .mfn-form .preview-imageinput').val()+'" alt="" /></div>');
                }else if( $('.panel-edit-item .mfn-form .preview-labelinput').val().length ){
                    $content.find('.'+it+' .chart .num').remove();
                    $content.find('.'+it+' .chart .image').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="num">'+$('.panel-edit-item .preview-labelinput').val()+'</div>');
                }

            }
        }else if($content.find('.'+it).hasClass('column_header_icon')){
            // header icon
            re_render();
        }else if($content.find('.'+it).hasClass('column_blockquote')){
            // blockquote icon
            if( $editrow.hasClass('icon_author') ){
                $content.find('.'+it+' .blockquote .author i').attr('class', 'icon-user');
            }else{
                $content.find('.'+it+' .blockquote .mfn-blockquote-icon i').attr('class', 'icon-quote');
            }
        }else if($content.find('.'+it).hasClass('column_icon_box_2')){
            // icon box 2
            if( $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.image .preview-imageinput').val().length ){
                if($content.find('.'+it+' .icon-wrapper').length){
                    $content.find('.'+it+' .icon-wrapper').html('<img class="scale-with-grid" src="'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.image .preview-imageinput').val()+'" alt="">');
                }else{
                    $content.find('.'+it+' .desc-wrapper').before('<div class="icon-wrapper"><img class="scale-with-grid" src="'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.image .preview-imageinput').val()+' alt=""></div>');
                }
            }else if( $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.label .mfn-field-value').val().length ){
                if( $content.find('.'+it+' .icon-wrapper').length ){
                    $content.find('.'+it+' .icon-wrapper').html('<span class="icon-label">'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.label .mfn-field-value').val()+'</span>');
                }else{
                    $content.find('.'+it+' .desc-wrapper').before('<div class="icon-wrapper"><span class="icon-label">'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.label .mfn-field-value').val()+'</span></div>');
                }
            }else{
                $content.find('.'+it+' .icon-wrapper').remove();
            }
        }else if($content.find('.'+it).hasClass('column_header_menu') && $editrow.hasClass('header_menu') && $editrow.hasClass('submenu_icon') ){
            // header menu submenu icon
            $content.find('.'+it+' .menu-sub').html('');
            $editpanel.find('.header_menu.submenu_icon_display ul.preview-submenu_icon_displayinput li:first-child a').trigger('click');
        }else if($content.find('.'+it).hasClass('column_sidemenu_menu') && $editrow.hasClass('sidemenu_menu') && $editrow.hasClass('submenu_icon') ){
            // header menu submenu icon
            $content.find('.'+it+' .outer-menu-sub').html('');
        }else if($content.find('.'+it).hasClass('column_megamenu_menu') && $editrow.hasClass('megamenu_menu submenu_icon') ){
            // megamenu submenu icon
            if($content.find('.'+it+' .menu-sub').length){
                $content.find('.'+it+' .menu-sub').remove();
            }
        }else if($content.find('.'+it).hasClass('column_header_search')){
            // header search icon
            if($content.find('.'+it+' .icon_search').length){
                $content.find('.'+it+' .icon_search').replaceWith('<svg class="icon_search" width="26" viewBox="0 0 26 26" aria-label="search icon"><defs><style>.path{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px;}</style></defs><circle class="path" cx="11.35" cy="11.35" r="6"></circle><line class="path" x1="15.59" y1="15.59" x2="20.65" y2="20.65"></line></svg>');
            }else{
                $content.find('.'+it+' form#searchform').prepend('<svg class="icon_search" width="26" viewBox="0 0 26 26" aria-label="search icon"><defs><style>.path{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1.5px;}</style></defs><circle class="path" cx="11.35" cy="11.35" r="6"></circle><line class="path" x1="15.59" y1="15.59" x2="20.65" y2="20.65"></line></svg>');
            }
        }else if($content.find('.'+it).hasClass('column_megamenu_menu') && $editrow.hasClass('megamenu_menu decoration_icon') ){
            // megamenu decoration icon
            if($content.find('.'+it+' .decoration-icon').length){
                $content.find('.'+it+' .decoration-icon').remove();
            }
        }else if($content.find('.'+it).hasClass('column_header_burger') && $content.find('.'+it).hasClass('column_header_burger') && $editrow.hasClass('icon')){
            // header menu burger
            if( $content.find('.'+it+' .icon-wrapper').length && $('.mfn-ui .panel-edit-item .mfn-form .header_burger.image .mfn-form-control.preview-imageinput').val().length ){
                $content.find('.'+it+' .icon-wrapper i').remove();
                $content.find('.'+it+' .icon-wrapper').prepend('<img src="'+$('.mfn-ui .panel-edit-item .mfn-form .header_burger.image .mfn-form-control.preview-imageinput').val()+'" alt="">');
            }else{
                $content.find('.'+it+' .icon-wrapper i').attr('class', 'icon-menu-fine');
            }
        }else if($content.find('.'+it).hasClass('column_accordion')){
            // accordion icon
            if( $input.hasClass('preview-icon_activeinput') ){
                $content.find('.'+it+' .accordion .question .title .acc-icon-minus').attr('class', 'acc-icon-minus icon-minus');
            }else{
                $content.find('.'+it+' .accordion .question .title .acc-icon-plus').attr('class', 'acc-icon-plus icon-plus');
            }
        }else if( $editrow.hasClass('query_display_slider_arrow_prev') ){
            $content.find('.'+it+' .swiper-button-prev i').attr('class', 'icon-left-open-big');
        }else if( $editrow.hasClass('query_display_slider_arrow_next') ){
            $content.find('.'+it+' .swiper-button-next i').attr('class', 'icon-right-open-big');
        }else if($content.find('.'+it).hasClass('column_popup_exit') && $editrow.hasClass('popup_exit icon') ){
            // exit popup close popup icon
            if( $('.mfn-form-row.popup_exit.image .mfn-field-value') && $content.find('.'+it+' .button_icon img').length ){
                return;
            }else{
                $content.find('.'+it+' .exit-mfn-popup').removeClass('has-icon');
                $content.find('.'+it+' .button_icon').remove();
            }
        }
    }

});


var presets = {
    init: function() {
        presets.show();
        presets.set();
        presets.export();
    },
    export: function() {
        $('.panel-export-import-presets .mfn-export-presets-button').on('click', function(e) {
            e.preventDefault();
            var $button = $(this);
            $('#export-presets-data-textarea').select();
            document.execCommand("copy");
            $button.find('span').text('Exported').addClass('mfn-icon-check-blue');
            setTimeout(function() { $button.find('span').html('Export'); }, 5000);
        });

        $('.panel-export-import-presets .mfn-import-presets-button').on('click', function(e) {
            e.preventDefault();
            var $input = $('.panel-export-import-presets #import-presets-data-textarea');
            var $button = $(this);
            $input.removeClass('error');

            if($button.hasClass('loading')) return false;

            if( !$input.val().length ){
                $input.addClass('error');
            }else{
                $button.addClass('loading');
                $.ajax({
                    url: mfnajaxurl,
                    data: {
                        action: 'mfnimportpreset',
                        'mfn-builder-nonce': wpnonce,
                        val: JSON.parse( $input.val() )
                    },
                    type: 'POST',
                    success: function(response){
                        $button.removeClass('loading').find('span').html('Imported');
                        setTimeout(function() { $button.find('span').html('Import'); }, 5000);
                        $input.val('');

                        mfnvbvars.presets = [];
                        mfnvbvars.presets = response;
                    }
                });
            }
        });
    },
    set: function() {
        $editpanel.on('click', '.mfn-ui .mfn-presets-list .dropdown-wrapper a.mfn-load-preset', function(e) {
            e.preventDefault();
            if( $(this).hasClass('loading') ) return;
            $(this).addClass('loading');
            var rerender = false;
            historyAllow = false;

            var uid = $(this).attr('data-uid');

            var styles = mfnvbvars.presets.filter( (item) => item.uid == uid )[0];

            if( !styles || typeof styles.attr == 'undefined' || typeof edited_item.attr == 'undefined' ) {
                $('.mfn-presets-list .dropdown-wrapper a').removeClass('loading');
                return;
            }

            if( styles.item != edited_item.jsclass ) {
                $('.mfn-presets-list .dropdown-wrapper a').removeClass('loading');
                return; // different items
            }

            $edited_div = $content.find('.vb-item[data-uid="'+edited_item.uid+'"]');

            // reset first
            for(key in edited_item.attr) {
                if( key.startsWith('style:') || ( typeof presets_keys[edited_item.jsclass] !== 'undefined' && presets_keys[edited_item.jsclass].length && presets_keys[edited_item.jsclass].includes(key) ) ) {
                    delete edited_item.attr[key];
                }
            }

            $content.find('style.mfn-local-style').remove();

            // set
            for (key in styles.attr) {
                edited_item.attr[key] = styles.attr[key];
            }

            openEditForm.do($edited_div, false);
            loopAllStyleFields();

            if( typeof presets_keys[edited_item.jsclass] !== 'undefined' && presets_keys[edited_item.jsclass].length ){
                $.each( presets_keys[edited_item.jsclass], function(i, el) {
                    if( $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+'.re_render').length ){
                        rerender = true;
                    }else if( $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+' .segmented-options').length ){
                        $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+' .segmented-options li.active a').trigger('click');
                    }else{
                        $editpanel.find('.panel-edit-item .mfn-vb-formrow.'+el+' .mfn-field-value').trigger('change');
                    }
                });
            }

            $('.mfn-presets-list .dropdown-wrapper a').removeClass('loading');

            historyAllow = true;

            if( rerender ) {
                re_render();
            }else if( edited_item.jsclass !== 'column'){
                historyStorage.add();
            }

        });
    },
    show: function() {
        $('.mfn-ui:not(.mfn-editing-section, .mfn-editing-wrap) .mfn-presets-list').on('mouseenter', function() {

            $editpanel.find('.mfn-presets-list .dropdown-wrapper').html('');
            var custom = false;
            var builded_in = false;

            if( mfnvbvars.presets.length ){
                var el_presets = mfnvbvars.presets.filter( (it) => it.item == edited_item.jsclass );
                $('.mfn-presets-list .dropdown-wrapper').append('<h6>Presets</h6>');
                if( el_presets.length > 0 ){
                    $.each(el_presets, function(y,x) {
                        if( !builded_in && x.type == 'mfn' ) builded_in = true;
                        if( !custom && x.type == 'custom' ){
                            custom = true;
                            if( builded_in ) $('.mfn-presets-list .dropdown-wrapper').append('<div class="mfn-dropdown-divider"></div>');
                        }
                        $('.mfn-presets-list .dropdown-wrapper').append('<li class="mfn-preset-type-'+x.type+'"><a class="mfn-dropdown-item mfn-load-preset" data-uid="'+x.uid+'" href="#"> '+x.name+'</a>'+( x.type == 'custom' ? "<span class=\"mfn-icon mfn-icon-delete mfn-preset-remove\"></span>" : "" )+'</li>');
                    });
                }else{
                    $('.mfn-presets-list .dropdown-wrapper').append('<i>No custom presets yet.</i>');
                }

            }

            $('.mfn-presets-list .dropdown-wrapper').append('<li><a class="mfn-btn mfn-btn-blue preset-action-button" data-uid="'+edited_item.uid+'" href="#" data-tooltip="Create new preset from current styles"><span class="btn-wrapper"><span class="mfn-icon mfn-icon-add"></span></span></a></li>');

            $('.mfn-presets-list a.preset-action-button').on('click', function(e) {
                e.preventDefault();
                presets.modal( $(this).attr('data-uid') );
            });

            $('.mfn-presets-list .dropdown-wrapper span.mfn-preset-remove').on('click', function() {
                var $a = $(this).siblings('a');
                if( $a.hasClass('loading') ) return;
                $a.addClass('loading');

                $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-delete"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Delete preset</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <img class="icon" alt="" src="'+mfnvbvars.themepath+'/muffin-options/svg/warning.svg"> <h3>Delete preset?</h3> <p>Please confirm. There is no undo.</p><a class="mfn-btn mfn-btn-red btn-wide btn-modal-confirm" href="#"><span class="btn-wrapper">Delete</span></a> </div></div></div>');

                $('.btn-modal-close').on('click', function(e) {
                    e.preventDefault();
                    $('.mfn-ui').removeClass('mfn-modal-open');
                    $('.modal-confirm.show').remove();
                });

                $('.btn-modal-confirm').on('click', function(e){
                    e.preventDefault();
                    var uid = $a.attr('data-uid');
                    $(this).addClass('loading');
                    $.ajax({
                        url: mfnajaxurl,
                        data: {
                            action: 'mfnremovepreset',
                            'mfn-builder-nonce': wpnonce,
                            item: uid
                        },
                        type: 'POST',
                        success: function(response){
                            $a.parent('li').remove();
                            mfnvbvars.presets = mfnvbvars.presets.filter( (it) => it.uid != uid );
                            $('.mfn-ui').removeClass('mfn-modal-open');
                            $('.modal-confirm.show').remove();
                        }
                    });

                });

            });

        }).on('click', function(e) {
            e.preventDefault();
        });
    },
    modal: function(uid) {
        $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-preset"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Add new preset</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"><div class="mfn-form-row"><input placeholder="Type preset name" type="text" class="mfn-form-control mfn-preset-name"></div><a class="mfn-btn mfn-btn-blue btn-modal-confirm" '+( mfnvbvars.view == 'demo' ? 'data-tooltip="Unavailable in Demo"' : '' )+' href="#"><span class="btn-wrapper">Save</span></a> <a class="mfn-btn btn-modal-close" href="#"><span class="btn-wrapper">Cancel</span></a> </div></div></div>');

        $('.btn-modal-close').on('click', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();
        });

        $('.btn-modal-confirm').on('click', function(e){
            e.preventDefault();
            $('.mfn-preset-name').removeClass('error');
            if( $('.mfn-preset-name').val() != '' ){
                presets.save(uid);
            }else{
                $('.mfn-preset-name').addClass('error');
            }
        });

    },
    save: function(uid) {

        if( mfnvbvars.view == 'demo' ) return;

        if( !$content.find('.preset-action-button').hasClass('loading') ){
            $content.find('.preset-action-button').addClass('loading');
            $content.find('.mfn-contextmenu-save-preset .label').text('Saving...');

            let pf = prepareForm( uid );

            var formData = JSON.parse(pf)[0];

            var save = {};
            var keys_in = [];

            if( typeof presets_keys[formData.jsclass] !== 'undefined' ){
                keys_in = presets_keys[formData.jsclass];
            }

            for (key in formData.attr) {
                if (key.startsWith('style:') || ( keys_in.length && keys_in.includes(key) )) {
                    save[key] = formData.attr[key];
                }
            }

            $.ajax({
                url: mfnajaxurl,
                data: {
                    action: 'mfnsavepreset',
                    'mfn-builder-nonce': wpnonce,
                    sections: save,
                    name: $('.mfn-preset-name').val(),
                    item: formData.jsclass
                },
                type: 'POST',
                success: function(response){

                    mfnvbvars.presets = [];

                    mfnvbvars.presets = response;

                    $content.find('.preset-action-button').removeClass('loading');
                    $('.modal-confirm.show').remove();
                    $content.find('.mfn-contextmenu-save-preset .label').text('Preset saved');

                    setTimeout(function() {
                        $content.find('.mfn-contextmenu-save-preset .label').text('Save preset');
                    }, 3000);

                }
            });
        }
    }
}

// show choose icon
$editpanel.on('click', '.mfn-form-row .browse-icon .mfn-button-upload', function(e) {
    e.preventDefault();
    if( $('.current-icon-editing').length ) $('.current-icon-editing').removeClass('current-icon-editing');
    $(this).closest('.browse-icon').addClass('current-icon-editing');
    $('.mfn-modal.modal-select-icon .mfn-items-list li').removeClass('active');
    $('.mfn-modal.modal-select-icon').addClass('show');
    $('.modal-select-icon.show .modalbox-search .mfn-search').focus();
});

sliderInput = {

    init: function($slider) {

        var max = false;
        var min = false;

        $slider.addClass('mfn-initialized');

        var $editbox = $slider.closest('.mfn-vb-formrow');
        var $inputgroup = $slider.closest('.form-group');

        var $hidden = $inputgroup.find('input.mfn-slider-hidden-input');
        var $input = $inputgroup.find('input.mfn-sliderbar-value');

        var css_path = $editbox.attr('data-csspath');
        var css_style = $editbox.attr('data-name');

        min = $input.attr('min');
        max = $input.attr('max');
        var step = $input.attr('data-step');
        //var unit = typeof $input.attr('data-unit') !== 'undefined' ? $input.attr('data-unit') : "";

        var unit = $editbox.find('.mfn-slider-unit li.active').length ? $editbox.find('.mfn-slider-unit li.active a').text() : $input.attr('data-unit');

        var value = $input.val() != '' ? $input.val() : 0;

        if( $inputgroup.find('.mfn-slider-unit').length ){
            min = $inputgroup.find('.mfn-slider-unit li.active').attr('data-min');
            max = $inputgroup.find('.mfn-slider-unit li.active').attr('data-max');
            step = $inputgroup.find('.mfn-slider-unit li.active').attr('data-step');
            unit = $inputgroup.find('.mfn-slider-unit li.active a').text();
        }

        if( value != '' && max && parseInt(value) > parseInt(max) ){
            value = max;
            $input.val(max);
            $hidden.val( max+unit ).trigger('change');
        }

        $slider.slider({
            range: parseFloat(min),
            min: parseFloat(min),
            max: parseFloat(max),
            step: parseFloat(step),
            value: value,
            start: function( event, ui ) {
                $('.sidebar-wrapper').addClass('mfn-vb-sidebar-overlay');

                // reset custom media queries
                if( $editbox.hasClass('show_under_custom') ){
                    $editpanel.find('.mfn-element-fields-wrapper .hide_under_custom input').val('').trigger('change');
                }else if( $editbox.hasClass('hide_under_custom') ){
                    $editpanel.find('.mfn-element-fields-wrapper .show_under_custom input').val('').trigger('change');
                }

            },
            slide: function(event, ui) {
                $input.val( ui.value );
                let value = ui.value;

                // instant transform effect
                if( $(ui.handle).closest('.transform_field').length ){
                    $input.trigger('change');

                }else if($editbox.hasClass('themeoption grid-width')){
                    if( $content.find('style#themeoptiongrid-width').length ){
                        $content.find('style#themeoptiongrid-width').html('@media only screen and (min-width: 1240px){.section_wrapper, .container{max-width: '+ui.value+'px; }}');
                    }else{
                        $content.find('body').append('<style id="themeoptiongrid-width">@media only screen and (min-width: 1240px){.section_wrapper, .container{max-width: '+ui.value+'px; }}</style>');
                    }
                }else if($editbox.hasClass('filter')){
                    // Set CSS filters in real time
                    var filter = '';
                    $editbox.closest('.css_filters_form').find('.mfn-sliderbar-value').each(function() {
                      var filter_key = $(this).attr('data-key');
                      var unit = $(this).attr('data-unit');

                      if( $(this).val().length ){
                        filter += filter_key+'('+$(this).val()+unit+') ';
                        $content.find(css_path).attr('style', 'filter: ' + filter);
                      }

                    });

                }else if( !$editbox.hasClass('gradient') && typeof css_path !== 'undefined' ){
                    $content.find(css_path.replace('|hover', '').replace('|not', '').replace('|before', '').replace('|after', '')).css( css_style, ui.value+unit );
                }/*else if( typeof css_path !== 'undefined' ){
                    $content.find(css_path.replace('|hover', '').replace('|not', '').replace('|before', '').replace('|after', '')).css( css_style, ui.value+unit );
                }*/

                else if($editbox.hasClass('gradient')){
                    gradientValue($editbox, true);
                }


            },
            stop: function(event, ui) {

                $input.val( ui.value ).trigger('change');

                if( typeof css_path !== 'undefined' && css_style !== 'transform'){
                    setTimeout(function() { changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', '').replaceAll('|after', ''), css_style, 'remove'); }, 50);
                }

                $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');
            }
        });
    },

    unitChange: function() {
        $editpanel.on('click', 'ul.mfn-slider-unit li a', function(e) {
            e.preventDefault();

            var $li = $(this).closest('li');
            var $editbox = $li.closest('.mfn-form-row');
            var $slider = $editbox.find('.sliderbar');

            if(!$li.hasClass('active')){
                $li.siblings().removeClass('active');
                $li.addClass('active');

                $editbox.find('.mfn-sliderbar-value').trigger('change');

                sliderInput.destroy($slider);
            }
        });
    },

    customValue: function() {
        $editpanel.on('change', '.mfn-sliderbar-value', function() {

            var $editbox = $(this).closest('.form-group');
            var $editwrapper = $(this).closest('.mfn-form-row');
            var value = $(this).val();

            var max = false;
            var min = false;

            min = $(this).attr('min');
            max = $(this).attr('max');

            if( $editbox.find('.mfn-slider-unit').length ){
                min = $editbox.find('.mfn-slider-unit li.active').attr('data-min');
                max = $editbox.find('.mfn-slider-unit li.active').attr('data-max');

                if( value != '' && max && parseInt(value) > parseInt(max) ){
                    value = max;
                    $(this).val(max);
                }
            }else{
                min = $(this).attr('min');
                max = $(this).attr('max');

                if( value != '' && max && parseInt(value) > parseInt(max) ){
                    value = max;
                    $(this).val(max);
                }
            }

            $editbox.find('.sliderbar').slider( "value", value );

            if( !$(this).hasClass('mfn-gradient-field') ){
                var $hidden = $editbox.find('input.mfn-slider-hidden-input');
                var unit = $editbox.find('.mfn-slider-unit li.active').length ? $editbox.find('.mfn-slider-unit li.active a').text() : $(this).attr('data-unit');
                if( value != '' ){
                    if( typeof unit !== 'undefined' ){ value = value+unit; }

                    if( typeof $editwrapper.attr('data-style-prefix') !== 'undefined' ){
                        $hidden.val( $editwrapper.attr('data-style-prefix')+value).trigger('change');
                    }else{
                        $hidden.val( value ).trigger('change');
                    }
                }else{
                    $hidden.val( '' ).trigger('change');
                }
            }

            // Set CSS filters in real time
            if( $editwrapper.hasClass('filter') ){

                var filter = '';
                $editbox.closest('.css_filters_form').find('.mfn-sliderbar-value').each(function() {
                  var filter_key = $(this).attr('data-key');
                  var unit = $(this).attr('data-unit');

                  if( $(this).val().length ){
                    filter += filter_key+'('+$(this).val()+unit+') ';
                  }

                });
                $editbox.closest('.css_filters_form').find('.mfn-field-value').val(filter).trigger('change');
            }

            if( $editwrapper.hasClass('gradient') ){
                gradientValue($editwrapper);
            }

            if( $editwrapper.hasClass('query_item_default_width') ){
                iframe.window.jQuery('body').trigger('resize');
                //console.log('stop sliderbar');
            }

        });
    },

    destroy: function($slider) {

        $slider.slider( "destroy" );
        sliderInput.init( $slider );
    }

}

function gradientValue($editbox, tmp = false){

    var $hidden = $editbox.closest('.gradient-form').find('.mfn-field-value');
    var type = $editbox.closest('.gradient-form').find('.gradient-type').val();
    var color = $editbox.closest('.gradient-form').find('.gradient-color').val();
    var location = $editbox.closest('.gradient-form').find('.gradient.location .mfn-sliderbar-value').val();
    var color2 = $editbox.closest('.gradient-form').find('.gradient-color2').val();
    var location2 = $editbox.closest('.gradient-form').find('.gradient.location2 .mfn-sliderbar-value').val();
    var position = $editbox.closest('.gradient-form').find('.gradient-position').val();
    var angle = $editbox.closest('.gradient-form').find('.gradient.angle .mfn-sliderbar-value').val();

    var val = '';

    if( !location.length ) $editbox.closest('.gradient-form').find('.gradient.location .mfn-sliderbar-value').val('0').trigger('change');
    if( !location2.length ) $editbox.closest('.gradient-form').find('.gradient.location2 .mfn-sliderbar-value').val('100').trigger('change');
    if( !angle.length ) $editbox.closest('.gradient-form').find('.gradient.angle .mfn-sliderbar-value').val('0').trigger('change');

    if( type.length && color.length && location.length && (angle.length || position.length) && color2.length && location2.length ){
        val += type+'(';
        if( type == 'linear-gradient' ){
            val += angle+'deg, ';
        }else{
            val += 'at '+position+', ';
        }
        val += color+' ';
        val += location+'%, ';
        val += color2+' ';
        val += location2+'%)';


        $content.find($editbox.attr('data-csspath').replace('|hover', '')).css( 'background-image', val );

    }

    if( !tmp ){
        $hidden.val( val ).trigger('change');
        changeInlineStyles($editbox.attr('data-csspath').replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), 'background-image', 'remove');
    }
}

var dynamicItems = {
    init: function() {

        $editpanel.on('change', '.dynamic_items_wrapper .di-input-rule select', function() {
            var val = $(this).val();
            $(this).parent().siblings('.di-input-wrapper').removeClass('di-input-active');
            $(this).parent().siblings('.di-if-'+val).addClass('di-input-active');
        });

        $editpanel.on('click', '.dynamic_items_wrapper .dynamic_items_add', function(e) {
            e.preventDefault();
            alert('soon');
        });

        $editpanel.on('click', '.dynamic_items_wrapper .di-remove', function(e) {
            e.preventDefault();
            var attr_uid = $(this).closest('li').attr('data-uid');
            var it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
            $content.find('.'+it+' .payment-methods-list li.uid-'+attr_uid).remove();
            $(this).closest('li').remove();

            edited_item.attr.dynamic_items = edited_item.attr.dynamic_items.filter( (item) => item.uid != attr_uid );

            historyStorage.add();
        });

        $editpanel.on('click', '.dynamic_items_wrapper .di-show-modal', function(e) {
            var id = $(this).attr('data-modal');
            $('#'+id).addClass('show');
        });

        $editpanel.on('click', '.mfn-modal-payments ul.mfn-items-list li a', function(e) {
            e.preventDefault();
            var url = $(this).find('img').attr('src');
            var title = $(this).find('.titleicon').text();
            dynamicItems.addNew(url, title);
            $('.mfn-modal-payments.show').removeClass('show');
        });

        $editpanel.on('mouseenter', '.dynamic_items_wrapper .dynamic_items_preview', function(e) {
            if( !$(this).hasClass('sortable-init') ){
                dynamicItems.sortable();
            }
        });
    },

    addNew: function(url, id = false) {
        var name = $editpanel.find('.dynamic_items_wrapper').attr('data-name');
        var it = $editpanel.find('.mfn-element-fields-wrapper').attr('data-element');
        var new_obj = {};
        var order = $('.dynamic_items_wrapper .dynamic_items_preview li').length;

        if( typeof edited_item['attr'][name] == 'undefined' ){
            edited_item['attr'][name] = [];
        }

        var new_uid = getUid();

        new_obj['url'] = url;
        if( id ) new_obj['id'] = id;
        new_obj['uid'] = new_uid;
        if( $editpanel.find('.dynamic_items_wrapper .di-input-rule select').length ){
            new_obj['type'] = $editpanel.find('.dynamic_items_wrapper .di-input-rule select').val();
        }
        edited_item['attr'][name].push(new_obj);

        $('.dynamic_items_wrapper .dynamic_items_preview').append('<li data-uid="'+new_uid+'" class="uid-'+new_uid+'"><img src="'+url+'" alt=""><a class="mfn-option-btn mfn-button-delete di-remove" data-tooltip="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a></li>');

        if( $content.find('.'+it+' .payment-methods-list:not(.empty)').length ){
            $content.find('.'+it+' .payment-methods-list').append('<li data-uid="'+new_uid+'" class="uid-'+new_uid+'"><img src="'+url+'" alt=""></li>');
        }else{
            setTimeout(re_render, 100);
        }

        historyStorage.add();
    },

    sortable: function() {
        $('.dynamic_items_wrapper .dynamic_items_preview').addClass('sortable-init');
        $('.dynamic_items_wrapper .dynamic_items_preview').sortable({
            update: function(e, ui) {
                var new_arr = [];

                $('.dynamic_items_wrapper .dynamic_items_preview li').each(function(i) {
                    new_arr.push( edited_item.attr.dynamic_items.filter( (item) => item.uid == $(this).attr('data-uid') )[0] );
                });

                edited_item.attr.dynamic_items = new_arr;

                setTimeout(re_render, 100);

            }
        });

    }

}

var multiSelectField = {

    init: function() {
        $editpanel.on('focus', '.mfn-multiselect-field-wrapper .form-control .mfn-multiselect-input', function(e) {
          e.preventDefault();
          $(this).closest('.mfn-multiselect-field-wrapper').addClass('mfn-msf-focus');
          $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');
          $(document).bind('click', multiSelectField.blur);

        })/*.on('blur', '.mfn-multiselect-field-wrapper .form-control .mfn-multiselect-input', function(e) {
            $(this).closest('.mfn-multiselect-field-wrapper').removeClass('mfn-msf-focus');
        })*/;

        $editpanel.on('click', '.mfn-multiselect-field-wrapper .mfn-multiselect-options li:not(.selected)', function() {
            //e.preventDefault();
            multiSelectField.add($(this));
            $('.mfn-ui .mfn-form .form-group.mfn-multiselect-field-wrapper .form-control .mfn-multiselect-input').val('').trigger('keyup');
        });

        $editpanel.on('click', '.mfn-ui .mfn-form .form-group.mfn-multiselect-field-wrapper .form-control span', function(e) {
            e.preventDefault();
            multiSelectField.remove($(this));
        });

        $editpanel.on('keyup paste change', '.mfn-ui .mfn-form .form-group.mfn-multiselect-field-wrapper .form-control .mfn-multiselect-input', function() {
            multiSelectField.search($(this));
        });

    },

    add: function( $li ) {
        var id = $li.attr('data-id');
        var label = $li.html().replaceAll('&nbsp;', '');
        $li.addClass('selected');

        $li.closest('.mfn-multiselect-field-wrapper').find('.form-control input').before('<span data-id="'+id+'">&#10005; '+label+'</span>');

        var name = $li.closest('.mfn-form-row').attr('data-id');
        //delete(edited_item.attr[name]);


        if( typeof edited_item.attr[name] === 'object' ){
            edited_item.attr[name].push( { key: id, value: label} );

        }else{
            edited_item.attr[name] = [];
            edited_item.attr[name].push( { key: id, value: label} );
        }

    },

    remove: function( $span ) {
        var id = $span.attr('data-id');
        var name = $span.closest('.mfn-form-row').attr('data-id');

        if( typeof edited_item.attr[name] === 'object' ) {
            if( edited_item.attr[name].filter( (item) => item.key == id ).length ) {
                edited_item.attr[name] = edited_item.attr[name].filter( (item) => item.key != id );
            }
        }

        re_render(edited_item.uid);

        $span.closest('.mfn-multiselect-field-wrapper').find('.mfn-multiselect-options li[data-id="'+id+'"]').removeClass('selected');
        $span.remove();

    },

    search: function($field) {

        var val = $field.val().toLowerCase();
        var $wrapper = $field.closest('.mfn-multiselect-field-wrapper');

        if( val.length ){
            if( val.length > 1 ){
                $wrapper.addClass('mfn-ms-searching');

                $wrapper.find('.mfn-multiselect-options li').hide();
                $wrapper.find('.mfn-multiselect-options li[data-name*="'+val+'"]').show();

            }else{
                $wrapper.removeClass('mfn-ms-searching');
                $wrapper.find('.mfn-multiselect-options li').removeAttr('style');
            }
        }else{
            $wrapper.removeClass('mfn-ms-searching');
            $wrapper.find('.mfn-multiselect-options li').removeAttr('style');
        }

    },

    blur: function(e) {
        var div = $('.mfn-multiselect-field-wrapper.mfn-msf-focus');

        if (!div.is(e.target) && div.has(e.target).length === 0){

            re_render(edited_item.uid);

            $('.mfn-multiselect-field-wrapper.mfn-msf-focus input').val('');
            $('.mfn-multiselect-field-wrapper.mfn-msf-focus').removeClass('mfn-msf-focus');
            $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');

            $(document).unbind('click', multiSelectField.blur);
        }

    }
}

multiSelectField.init();

var multiTextField = {
    init: function() {
        $editpanel.on('click', '.sidebar-add .sidebar-add-button', function(e) {
          e.preventDefault();

          var $form = $(this).closest('.form-group'),
            $clone = $('li.default', $form).clone(true),
            li_length = $('.added-sidebars ul li:not(.default)', $form).length;

          var val = $('.mfn-form-input', $form).val();

          if( ! val ){
            return false;
          }

          $('.added-sidebars ul', $form).append( $clone );

          // $clone = $('.added-sidebars ul li:last-child', $form);

          $clone.removeClass('default')
            .hide().fadeIn(200);

          $clone.find('input').val( val )
            .attr('name', 'sidebars['+li_length+']' )
            .attr('data-key', li_length )
            .removeAttr('data-name').trigger('change');
          $clone.find('.sidebar-title').text( val );

          $('.mfn-form-input', $form).val('');

          $form.removeClass('empty');

        });

        $editpanel.on('click', '.sidebar-add .added-sidebars .mfn-btn-delete', function(e) {
          e.preventDefault();

          var $form = $(this).closest('.form-group');
          var key = $(this).siblings('input').attr('data-key');
          var name = $(this).closest('.mfn-vb-formrow').attr('data-name');
          var $input = $(this).siblings('input');

          if( typeof mfnDbLists.themeoptions[name][key] !== undefined ) delete(mfnDbLists.themeoptions[name][key]);

          $(this).parent().fadeOut( 200, function() {

            $input.val('').trigger('change');

            $(this).remove();

            if( 1 >= $('.added-sidebars ul li', $form).length ){
              $form.addClass('empty');
            }

          });

        });
    }
}
multiTextField.init();

dynamicItems.init();

var tabsField = {
    init: function() {

        $editpanel.on('click', '.tabs .mfn-button-add', function(e) {
            e.preventDefault();
            var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
            var $form = $(this).closest('.form-group'),
            $clone = $('li.default', $form).clone(true);
            $clone.removeClass('default').addClass('show');
            $('.tabs-wrapper', $form).append( $clone );
            var new_obj = {};
            $clone.find('.field-to-object').each(function(){
                $(this).attr('name', $(this).data('default') ).removeAttr('data-default');
                new_obj[ $(this).attr('data-label') ] = $(this).val();
            });

            if( typeof edited_item.attr.tabs !== 'undefined' ){
                edited_item.attr.tabs.push(new_obj);
            }else{
                edited_item.attr.tabs = [];
                edited_item.attr.tabs.push(new_obj);
            }

            $clone.siblings().removeClass('show');
            $clone.hide().fadeIn(200);
            tabsField.reorder();
            re_render(edited_item.uid);
        });

        $editpanel.on('click', '.tabs .mfn-tab-delete', function(e) {
          e.preventDefault();
          var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
          $(this).closest('.tab').fadeOut( 200, function() {
            $(this).remove();
            tabsField.reorder();
            setTimeout(re_render(edited_item.uid), 1000);
          });
        });

        $editpanel.on('click', '.tabs .mfn-tab-clone', function(e) {
          e.preventDefault();
          var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
          var $tab = $(this).closest('.tab'),
            $clone = $tab.clone(true);
          $tab.removeClass('show').after( $clone );
          $clone.hide().fadeIn(200);
          tabsField.reorder();
          setTimeout(re_render(edited_item.uid), 1000);
        });

        $editpanel.on('click', '.tabs .mfn-tab-toggle', function(e) {
          e.preventDefault();
          var $tab = $(this).closest('.tab');
          $tab.toggleClass('show')
            .siblings().removeClass('show');
        });

        $editpanel.on('change', '.tabs .js-title', function(e) {
            e.preventDefault();
            var $tab = $(this).closest('.tab');
            var val = $(this).val();

            // temporary, second child instead of 'secondary' index
            if(!val.length){
              val = $tab.find('.form-control:nth-child(2) input').val();
              $('.tab-header .title', $tab).text(val);
            }

            $('.tab-header .title', $tab).text(val);
        });
    },

    sortable: function() {
        $('.panel-edit-item .tabs-wrapper:not(.mfn-initialized)').each(function() {
            $(this).addClass('mfn-initialized');
            var $editbox = $(this).closest('.mfn-vb-formrow');
            var group = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');
            $(this).sortable({
                axis: 'y',
                cursor: 'ns-resize',
                handle: '.tab-header',
                opacity: 0.9,
                update: function(e, ui) {

                    if($editbox.hasClass('order')) {
                        var $input = $editbox.find('input.mfn-field-value');
                        var value = [];
                        $('.panel-edit-item .order .tabs-wrapper li').each(function(){
                          value.push( $(this).text().toLowerCase() );
                        });
                        $input.val( value.join(',') ).trigger('change');

                    }else{
                        tabsField.reorder();
                        setTimeout(re_render(edited_item.uid), 500);
                    }

                }
            });
        });
    },
    reorder: function() {
        edited_item.attr.tabs = [];
        $('.panel-edit-item .mfn-form ul.tabs-wrapper li.tab:not(.default)').each(function(i) {
            var new_obj = {};
            $(this).find('.field-to-object').each(function() {
                var $input = $(this);
                var old_name = $input.attr('name');
                var patt_tabs = /tabs\[([0-9]|[0-9][0-9])\]/g;
                var new_attr_name = old_name.replace(patt_tabs, 'tabs['+i+']');
                $input.attr( 'name', new_attr_name );
                $input.attr( 'data-order', i );
                new_obj[ $input.attr('data-label') ] = $input.val();
            });
            edited_item.attr.tabs.push(new_obj);
        });
    }
}

tabsField.init();

// contact box address
$editpanel.on('keyup paste change', '.contact_box.address .preview-addressinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if( isBlocks() ){
      $content.find('.'+it+' .item-preview-content ').text(val);
    } else if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.address .address_wrapper').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.address .address_wrapper').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="1" class="address"><span class="icon"><i class="icon-location"></i></span><span class="address_wrapper">'+val+'</span></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.address').remove();
    }

});

// header search placeholder
$editpanel.on('keyup paste change', '.panel-edit-item .header_search.placeholder .mfn-field-value', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    $content.find('.'+it+' .search_wrapper input.field').attr('placeholder', val);

});


// contact box phone
$editpanel.on('keyup paste change', '.contact_box.telephone .preview-telephoneinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-1 p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-1 p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="2" class="phone phone-1"><span class="icon"><i class="icon-phone"></i></span><p><a href="tel:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-1').remove();
    }

});

// contact box phone 2
$editpanel.on('keyup paste change', '.contact_box.telephone_2 .preview-telephone_2input', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-2 p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-2 p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="3" class="phone phone-2"><span class="icon"><i class="icon-phone"></i></span><p><a href="tel:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.phone-2').remove();
    }

});

// contact box fax
$editpanel.on('keyup paste change', '.contact_box.fax .preview-faxinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.phone.fax p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.fax p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="4" class="phone fax"><span class="icon"><i class="icon-print"></i></span><p><a href="fax:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.phone.fax').remove();
    }

});

// contact box email
$editpanel.on('keyup paste change', '.contact_box.email .preview-emailinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.mail p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.mail p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="5" class="mail"><span class="icon"><i class="icon-mail"></i></span><p><a href="mailto:'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.mail').remove();
    }

});

// contact box www
$editpanel.on('keyup paste change', '.contact_box.www .preview-wwwinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if(val.length){
        if($content.find('.'+it+' .get_in_touch_wrapper ul li.www p a').length){
            $content.find('.'+it+' .get_in_touch_wrapper ul li.www p a').html(val);
        }else{
            $content.find('.'+it+' .get_in_touch_wrapper ul').append('<li data-sort="6" class="www"><span class="icon"><i class="icon-link"></i></span><p><a target="_blank" href="https://'+val+'">'+val+'</a></p></li>');
        }
    }else{
        $content.find('.'+it+' .get_in_touch_wrapper ul li.www').remove();
    }

});

// call to action button
$editpanel.on('keyup paste change', '.preview-button_titleinput', function() {
    let val = $(this).val();
    let icon = $(this).closest('.mfn-element-fields-wrapper').find('.preview-iconinput').val();

    if($edited_div.hasClass('column_call_to_action')){
        // call to action button
        if( val ){
            if( icon.length ){
                $edited_div.find('.call_center').html('<a href="#" class="button has-icon "><span class="button_icon"><i class="'+$('.mfn-element-fields-wrapper .preview-iconinput').val()+'"></i></span><span class="button_label">'+val+'</span></a>');
            }else{
                $edited_div.find('.call_center').html('<a href="#" class="button"><span class="button_label">'+val+'</span></a>');
            }
        }else{
            $edited_div.find('.call_center').html('<span class="icon_wrapper"><i class="'+$('.mfn-element-fields-wrapper .preview-iconinput').val()+'"></i></span>');
        }
    }
});

// helper title 1
$editpanel.on('keyup paste change', '.helper.title1 .preview-title1input', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .links .link-1').length){
        $content.find('.'+it+' .links .link-1').html(val);
    }else{
        $content.find('.'+it+' .links').prepend('<a class="link link-1 toggle" href="#" data-rel="1">'+val+'</a>');
    }
});

// helper title 2
$editpanel.on('keyup paste change', '.helper.title2 .preview-title2input', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .links .link-2').length){
        $content.find('.'+it+' .links .link-2').html(val);
    }else{
        $content.find('.'+it+' .links').append('<a class="link link-2 toggle" href="#" data-rel="2">'+val+'</a>');
    }
});

// universal txt edit function

function fieldUpdate($field){
    let $box = $field.closest('.mfn-form-row');
    let rare_tag = $box.attr('data-edittag');
    let tag = rare_tag.replace(' | ', ' ');
    let tag_wrapper = rare_tag.split(' | ')[0];
    let tag_el = rare_tag.split(' | ')[1];
    let tag_child = $box.attr('data-edittagchild');
    let tag_pos = $box.attr('data-tagposition');
    let tag_var = $box.attr('data-edittagvar');
    let it = '.'+$box.closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $field.val();

    if(tag_el.includes('.')){
        var tag_el_ex = tag_el.split('.');
        if( $('.panel-edit-item .'+tag_var+' .active input').length ){
            tag = tag_wrapper + ' ' +$('.panel-edit-item .'+tag_var+' .active input').val()+'.'+tag_el_ex[1];
        }else if(tag_el_ex[0]){
            tag = tag_wrapper + ' ' +tag_el_ex[0]+'.'+tag_el_ex[1];
        }
    }else if( tag_child ){
        tag = tag+' '+tag_child;
    }

    // console.log('# fieldUpdate');

    if( isBlocks() ){

      if( 'title' == $box.attr('data-id') ){
        tag = '.item-preview-title';
      } else if( 'content' == $box.attr('data-id') ) {
        tag = '.item-preview-content';
      } else if( 'subtitle' == $box.attr('data-id') ) {
        tag = '.item-preview-subtitle';
      } else if( 'slogan' == $box.attr('data-id') ) {
        tag = '.item-preview-subtitle';
      } else if( 'price' == $box.attr('data-id') ) { // pricing item
        tag = '.item-preview-number';
      } else {
        return;
        // re_render();
      }
    }

    if($content.find(it+' '+tag).length){
        if( val == '' ){
            $content.find(it+' '+tag).html('').hide();
            return;
        }else if( !$content.find(it+' '+tag).is(':visible') ){
            $content.find(it+' '+tag).show().removeClass('empty');
        }

        if( $edited_div.hasClass('column_code') ){
            $content.find(it+' '+tag).text(val);
        }else{
            $content.find(it+' '+tag).html(val);
        }
    }else{

        if(tag_el.includes('.')){

            var tag_el_ex = tag_el.split('.');

            if( $('.panel-edit-item .'+tag_var+' .active input').length ){

                var html = document.createElement( $('.panel-edit-item .'+tag_var+' .active input').val() );
            }else if(tag_el_ex[0]){
                var html = document.createElement( tag_el_ex[0] );
            }else{
                var html = document.createElement( 'h4' );
            }

            html.classList.add(tag_el_ex[1]);


        }else{
            var html = document.createElement(tag_el);
        }

        if( tag_child ){
            var html_child = document.createElement(tag_child);
            html_child.innerHTML = val;
            html.appendChild(html_child);
        }else{
            html.innerHTML = val;
        }

        if( tag_pos.includes('|') ){

            var tag_pos_exp = tag_pos.split(' | ');
            if( tag_pos_exp[0] == 'before' ){
                $content.find(it+' '+tag_pos_exp[1]).before( html );
            }else{
                $content.find(it+' '+tag_pos_exp[1]).after( html );
            }

        }else{
            if( tag_pos == 'prepend' ){
                $content.find(it+' '+tag_wrapper).prepend( html );
            }else{
                $content.find(it+' '+tag_wrapper).append( html );
            }
        }

    }
}

function lottie_play(){
    var it = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');

    var frame_start = $editpanel.find('.lottie.frame_start .mfn-field-value').val();
    var frame_end = $editpanel.find('.lottie.frame_end .mfn-field-value').val();
    var direction = $editpanel.find('.lottie.direction li.active input').val();

    iframe.window['start'+it+'frame'] = Math.floor( (parseInt(frame_start)*iframe.window[it].animationData.op)/100 );
    iframe.window['total'+it+'frames'] = Math.floor( (parseInt(frame_end)*iframe.window[it].animationData.op)/100 );

    iframe.window['frames'+it] = [iframe.window['start'+it+'frame'], iframe.window['total'+it+'frames']];
    iframe.window['frames'+it+'_reverse'] = [iframe.window['total'+it+'frames'], iframe.window['start'+it+'frame']];

    if(direction == '-1') {
        iframe.window[it].playSegments( iframe.window['frames'+it+'_reverse'], true);
    }else{
        iframe.window[it].playSegments( iframe.window['frames'+it], true);
    }
}

// lottie start
$editpanel.on('change', '.lottie .mfn-field-value', function() {
    var $editrow = $(this).closest('.mfn-vb-formrow');
    var val = $(this).val();
    var it = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');
    var $trigger_field = $editpanel.find('.lottie.trigger .mfn-field-value');

    var current_lottie = iframe.window[it];

    if( $editrow.hasClass('speed') ){
        if( $trigger_field.val() == 'scroll' ){
            re_render();
        }else{
            iframe.window[it].setSpeed(val);
            lottie_play();
        }
    }else if( $editrow.hasClass('trigger') && val == 'scroll' ){
        $('.panel-edit-item .lottie.loop li:first-child a').trigger('click');
        $('.panel-edit-item .lottie.direction li:first-child a').trigger('click');
    }else if( $editrow.hasClass('frame_start') || $editrow.hasClass('frame_end') ){
        if( $trigger_field.val() == 'scroll' ){
            re_render();
        }else{
            lottie_play();
        }
    }else if( $editrow.hasClass('src') && val != '' ){
        $editpanel.find('.lottie.file .browse-image .mfn-button-delete').trigger('click');
    }else if( $editrow.hasClass('file') && val != '' ){
        $editpanel.find('.lottie.src .mfn-field-value').val('');
    }
});
// lottie end

$editpanel.on('keyup paste change', '.content-txt-edit .mfn-field-value', function() {
    fieldUpdate($(this));
});

// re render

$editpanel.on('change', '.absolute-pos-watcher .mfn-field-value', function(){
    var val = $(this).val();
    if( val == 'absolute'){
        $edited_div.addClass('mcb-column-absolute');
    }else{
        $edited_div.removeClass('mcb-column-absolute');
    }
});

$editpanel.on('change', '.preview-numberinput', function() {
    // number
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if( isBlocks() ){
      if($content.find('.'+it+' .item-preview-number').length){
        $content.find('.'+it+' .item-preview-number').text(val);
      }
    }else if($edited_div.hasClass('column_counter')){
        // counter
        if($content.find('.'+it+' .desc_wrapper .number').length){
            $content.find('.'+it+' .desc_wrapper .number').text(val);
        }else{
            if($content.find('.'+it+' .desc_wrapper .number-wrapper').length){
                $content.find('.'+it+' .desc_wrapper .number-wrapper').append('<span class="number" data-to="'+val+'">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="number" data-to="'+val+'">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_how_it_works')){
        // how it works
        if($content.find('.'+it+' .number').length){
            $content.find('.'+it+' .number').text(val);
        }else{
            $content.find('.'+it+' .image').html('<span class="number">'+val+'</span>');
        }
    }else if($edited_div.hasClass('column_quick_fact')){
        // quick fact
        if($content.find('.'+it+' .number-wrapper .number').length){
            $content.find('.'+it+' .number-wrapper .number').attr('data-to', val).text(val);
        }else{
            $content.find('.'+it+' .quick_fact').prepend('<div class="number-wrapper"><span class="number" data-to="'+val+'">'+val+'</span></div>');
        }
    }
});

$editpanel.on('keyup paste change', '.preview-prefixinput', function() {
    // prefix
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_counter')){
        // counter
        if($content.find('.'+it+' .desc_wrapper .label.prefix').length){
            $content.find('.'+it+' .desc_wrapper .label.prefix').text(val);
        }else{
            if($content.find('.'+it+' .desc_wrapper .number-wrapper').length){
                $content.find('.'+it+' .desc_wrapper .number-wrapper').prepend('<span class="label prefix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label prefix">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_quick_fact')){
        // quick fact prefix
        if($content.find('.'+it+' .number-wrapper .prefix').length){
            $content.find('.'+it+' .number-wrapper .prefix').text(val);
        }else{
            if($content.find('.'+it+' .number-wrapper').length){
                $content.find('.'+it+' .number-wrapper').prepend('<span class="label prefix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label prefix">'+val+'</span></div>');
            }
        }
    }
});
$editpanel.on('keyup paste change', '.preview-labelinput', function() {
    // postfix
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_counter')){
        // counter
        if($content.find('.'+it+' .desc_wrapper .label.postfix').length){
            $content.find('.'+it+' .desc_wrapper .label.postfix').text(val);
        }else{
            if($content.find('.'+it+' .desc_wrapper .number-wrapper').length){
                $content.find('.'+it+' .desc_wrapper .number-wrapper').append('<span class="label postfix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label postfix">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_quick_fact')){
        // quick fact postfix
        if($content.find('.'+it+' .number-wrapper .label.postfix').length){
            $content.find('.'+it+' .number-wrapper .label.postfix').text(val);
        }else{
            if($content.find('.'+it+' .number-wrapper').length){
                $content.find('.'+it+' .number-wrapper').append('<span class="label postfix">'+val+'</span>');
            }else{
                $content.find('.'+it+' .desc_wrapper').prepend('<div class="number-wrapper"><span class="label postfix">'+val+'</span></div>');
            }
        }
    }else if($edited_div.hasClass('column_chart')){
        // chart

        if(val.length){
            if($content.find('.'+it+' .num').length){
                $content.find('.'+it+' .num').text(val);
            }else{

                if( !$content.find('.'+it+' .chart > .image').length && !$content.find('.'+it+' .chart > .icon').length ){
                    $content.find('.'+it+' .chart').prepend('<div class="num">'+val+'</div>');
                }else{
                    if(!$content.find('.'+it+' .chart .mfn_tmp_info').length){
                        $content.find('.'+it+' .chart').append('<span class="mfn_tmp_info">Picture and icon have higher priority. Delete them to see label.</span>');
                        setTimeout(function() {
                            $content.find('.mfn_tmp_info').remove();
                        }, 3000);
                    }
                }
            }
        }else{
            if( $('.panel-edit-item .mfn-form .preview-imageinput').val().length ){
                if($content.find('.'+it+' .chart .image img').length){
                    $content.find('.'+it+' .chart .image img').attr('src', $('.panel-edit-item .mfn-form .preview-imageinput').val());
                }else{
                    $content.find('.'+it+' .chart .num').remove();
                    $content.find('.'+it+' .chart .icon').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="image"><img class="scale-with-grid" src="'+$('.panel-edit-item .mfn-form .preview-imageinput').val()+'" alt="" /></div>');
                }
            }else if( $('.panel-edit-item .mfn-form .preview-iconinput').val().length ){
                if($content.find('.'+it+' .chart .icon i').length){
                    $content.find('.'+it+' .chart .icon i').attr('class', $('.panel-edit-item .mfn-form .preview-iconinput').val());
                }else{
                    $content.find('.'+it+' .chart > .image').remove();
                    $content.find('.'+it+' .chart > .num').remove();
                    $content.find('.'+it+' .chart').prepend('<div class="icon"><i class="'+$('.panel-edit-item .mfn-form .preview-iconinput').val()+'"></i></div>');
                }
            }

        }
    }else if($edited_div.hasClass('column_icon_box_2')){
        // icon box 2

        if( $('.panel-edit-item .mfn-form .icon_box_2.image .mfn-field-value').val().length || $('.panel-edit-item .mfn-form .icon_box_2.icon .mfn-field-value').val().length ){
            if( !$content.find('.'+it+' .mfn-icon-box .mfn_tmp_info').length ){
                $content.find('.'+it+' .mfn-icon-box').prepend('<span style="margin-bottom: 20px;" class="mfn_tmp_info">Image and icon have higher priority. Delete them to see label.</span>');
                setTimeout(function() {
                    $content.find('.mfn_tmp_info').remove();
                }, 3000);
            }
        }else if(val.length){
            if( $content.find('.'+it+' .mfn-icon-box .icon-wrapper').length ){
                $content.find('.'+it+' .mfn-icon-box .icon-wrapper').html('<span class="icon-label">'+val+'</span>');
            }else{
                $content.find('.'+it+' .mfn-icon-box .desc-wrapper').before('<div class="icon-wrapper"><span class="icon-label">'+val+'</span></div>');
            }
        }else{
            $content.find('.'+it+' .mfn-icon-box .icon-wrapper').remove();
        }
    }

});


$editpanel.on('change', '.preview-positioninput', function() {
    var val = $(this).val();

    if(!val.length){
        $('.panel-edit-item .mfn-element-fields-wrapper .activeif-item_position input').val('').trigger('change');
    }

});

$editpanel.on('keyup paste change', '.mfn-element-fields-wrapper .preview-titleinput', function() {
    // title
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_list')){
        // list
        if($content.find('.'+it+' .list_right h4').length){
            $content.find('.'+it+' .list_right h4').html(val);
        }else if($content.find('.'+it+' .circle').length){
            $content.find('.'+it+' .circle').html(val);
        }
    }

});

$editpanel.on('change', '.mfn-element-fields-wrapper .responsive-custom-visibility .mfn-field-value', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    let label = 'Hide under ';

    if( $(this).closest('.mfn-form-row').hasClass('show_under_custom')){
        label = 'Show under ';
        $editpanel.find('.mfn-element-fields-wrapper .hide_under_custom input').val('');
    }else{
        $editpanel.find('.mfn-element-fields-wrapper .show_under_custom input').val('');
    }

    $edited_div.attr('data-tooltip', label+val);
    $edited_div.attr('data-position', 'bottom');
});

// custom ID

$editpanel.on('change', '.custom_id .preview-custom_idinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    let uid = $edited_div.attr('data-uid');
    if(val.length){
        $edited_div.attr('id', val);
        /*if( $navigator.find('.nav-'+uid+' .navigator-section-id').length ){
            $navigator.find('.nav-'+uid+' .navigator-section-id').text('#'+val);
        }else{
            $navigator.find('.nav-'+uid+' > a').append('<span class="navigator-section-id">#'+val+'</span>');
        }*/
    }else{
        $edited_div.removeAttr('id');
        /*if( $navigator.find('.nav-'+uid+' .navigator-section-id').length ){
            $navigator.find('.nav-'+uid+' .navigator-section-id').remove();
        }*/
    }
});

// our team list links email fb twitter linkedin vcard
$editpanel.on('keyup paste change', '.our_team_list.email .preview-emailinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.mail').length){
                $content.find('.'+it+' .bq_wrapper .links a.mail').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').prepend('<a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.mail').remove();
    }
});

$editpanel.on('keyup paste change', '.our_team_list.facebook .preview-facebookinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.facebook').length){
                $content.find('.'+it+' .bq_wrapper .links a.facebook').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.facebook').remove();
    }
});

$editpanel.on('keyup paste change', '.our_team_list.twitter .preview-twitterinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.twitter').length){
                $content.find('.'+it+' .bq_wrapper .links a.twitter').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.twitter').remove();
    }
});

$editpanel.on('keyup paste change', '.our_team_list.linkedin .preview-linkedininput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.linkedin').length){
                $content.find('.'+it+' .bq_wrapper .links a.linkedin').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.linkedin').remove();
    }
});
$editpanel.on('keyup paste change', '.our_team_list.vcard .preview-vcardinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .bq_wrapper .links').length){
            if($content.find('.'+it+' .bq_wrapper .links a.vcard').length){
                $content.find('.'+it+' .bq_wrapper .links a.vcard').attr('href', val);
            }else{
                $content.find('.'+it+' .bq_wrapper .links').append('<a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .bq_wrapper').append('<div class="links"><a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .bq_wrapper .links a.vcard').remove();
    }
});

// our team list blockquote
$editpanel.on('keyup paste change', '.our_team_list.blockquote .preview-blockquoteinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .column .bq_wrapper blockquote').length){
        $content.find('.'+it+' .column .bq_wrapper blockquote').html(val);
    }else{
        $content.find('.'+it+' .column .bq_wrapper').prepend('<div class="blockquote"><span class="mfn-blockquote-icon"><i class="icon-quote"></i></span><blockquote>'+val+'</blockquote></div>');
    }
});

// our team
$editpanel.on('keyup paste change', '.our_team.blockquote .preview-blockquoteinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' .desc_wrapper blockquote').length){
        $content.find('.'+it+' .desc_wrapper blockquote').html(val);
    }else{
        $content.find('.'+it+' .desc_wrapper').append('<blockquote>'+val+'</blockquote>');
    }
});

// our team links email fb twitter linkedin vcard
$editpanel.on('keyup paste change', '.our_team.email .preview-emailinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.mail').length){
                $content.find('.'+it+' .desc_wrapper .links a.mail').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').prepend('<a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a href="mailto:'+val+'" class="icon_bar icon_bar_small mail"><span class="t"><i class="icon-mail"></i></span><span class="b"><i class="icon-mail"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.mail').remove();
    }
});

$editpanel.on('keyup paste change', '.our_team.facebook .preview-facebookinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.facebook').length){
                $content.find('.'+it+' .desc_wrapper .links a.facebook').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small facebook"><span class="t"><i class="icon-facebook"></i></span><span class="b"><i class="icon-facebook"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.facebook').remove();
    }
});

$editpanel.on('keyup paste change', '.our_team.twitter .preview-twitterinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.twitter').length){
                $content.find('.'+it+' .desc_wrapper .links a.twitter').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small twitter"><span class="t"><i class="icon-twitter"></i></span><span class="b"><i class="icon-twitter"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.twitter').remove();
    }
});

$editpanel.on('keyup paste change', '.our_team.linkedin .preview-linkedininput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.linkedin').length){
                $content.find('.'+it+' .desc_wrapper .links a.linkedin').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a target="_blank" href="'+val+'" class="icon_bar icon_bar_small linkedin"><span class="t"><i class="icon-linkedin"></i></span><span class="b"><i class="icon-linkedin"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.linkedin').remove();
    }
});

$editpanel.on('keyup paste change', '.preview-cart_button_textinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($content.find('.'+it+' button[type="submit"]').length){
        $content.find('.'+it+' button[type="submit"]').text(val);
    }
});

$editpanel.on('keyup paste change', '.our_team.vcard .preview-vcardinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if(val.length){
        if($content.find('.'+it+' .desc_wrapper .links').length){
            if($content.find('.'+it+' .desc_wrapper .links a.vcard').length){
                $content.find('.'+it+' .desc_wrapper .links a.vcard').attr('href', val);
            }else{
                $content.find('.'+it+' .desc_wrapper .links').append('<a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a>');
            }
        }else{
            $content.find('.'+it+' .desc_wrapper').append('<div class="links"><a href="'+val+'" class="icon_bar icon_bar_small vcard"><span class="t"><i class="icon-vcard"></i></span><span class="b"><i class="icon-vcard"></i></span></a></div>');
        }
    }else{
        $content.find('.'+it+' .desc_wrapper .links a.vcard').remove();
    }
});

$editpanel.on('keyup paste change', '.preview-phoneinput', function() {
    // phone
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_our_team')){
        // our team
        if($content.find('.'+it+' .desc_wrapper p.phone a').length){
            $content.find('.'+it+' .desc_wrapper p.phone a').text(val);
        }else{
            $content.find('.'+it+' .desc_wrapper .hr_color').before('<p class="phone"><i class="icon-phone"></i> <a href="#">'+val+'</a></p>');
        }
    }else if($edited_div.hasClass('column_our_team_list')){
        // our team
        if($content.find('.'+it+' .desc_wrapper p.phone a').length){
            $content.find('.'+it+' .desc_wrapper p.phone a').text(val);
        }else{
            $content.find('.'+it+' .desc_wrapper .hr_color').before('<p class="phone"><i class="icon-phone"></i> <a href="#">'+val+'</a></p>');
        }
    }
});

$editpanel.on('change', '.widget-chart .preview-line_widthinput', function() {
    // chart
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    $content.find('.'+it+' .chart').attr('data-line-width', val);
    $content.find('.'+it+' .chart_box').removeClass('mfn-initialized');
    mfnChart();
});

$editpanel.on('change', '.gallery-msnry-rerender-item .mfn-field-value', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if( $content.find('.'+it+' .gallery').hasClass('masonry') ) {
        setTimeout(function() { re_render(edited_item.uid); }, 100);
    }
});

// mennu pointer position top/bottom
$editpanel.on('change', ' .preview-menu-pointer-positioninput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    $edited_div.removeClass('mfn-pointer-bottom');
    if(val.length){
        $edited_div.addClass(val);
    }
});

$editpanel.on('change', '.preview-stretchinput', function() {
    // stretch image
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    if($edited_div.hasClass('column_image')){
        // image stretch
        $content.find('.'+it+' .image_frame').removeClass('stretch-ultrawide stretch');
        if(val == 'ultrawide'){
            $content.find('.'+it+' .image_frame').addClass('stretch-ultrawide');
        }else if(val == "1"){
            $content.find('.'+it+' .image_frame').addClass('stretch');
        }
    }
});

$editpanel.on('change', '.panel-edit-item .mfn-form .form-group.font-family-select select', function() {
    var val = $(this).val();
    $(this).attr('data-value', val);
});

// query builder query loop settings

$editpanel.on('change', '.query_slider_columns .mfn-field-value', function() {
    /*var val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    if( val <= 0 ) return;

    var percent = 100 / parseInt(val);
    $editpanel.find('.mfn-form-row.mfn_field_'+screen+'.query_item_default_width .mfn-field-value').val(percent+"%").trigger('change');*/
    updateColumnsRwd();
});

$editpanel.on('change', '.query_slider_columns_tablet .mfn-field-value', function() {
    /*var val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    if( val <= 0 ) return;

    var percent = 100 / parseInt(val);
    $editpanel.find('.mfn-form-row.mfn_field_'+screen+'.query_item_default_width .mfn-field-value').val(percent+"%").trigger('change');*/
    updateColumnsRwd();
});

$editpanel.on('change', '.query_slider_columns_mobile .mfn-field-value', function() {
    /*var val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    if( val <= 0 ) return;

    var percent = 100 / parseInt(val);
    $editpanel.find('.mfn-form-row.mfn_field_'+screen+'.query_item_default_width .mfn-field-value').val(percent+"%").trigger('change');*/
    updateColumnsRwd();
});

function updateColumnsRwd() {

    var val_desktop = $('.query_slider_columns .mfn-field-value').val();
    var val_tablet =  $('.query_slider_columns_tablet .mfn-field-value').val();
    var val_mobile =  $('.query_slider_columns_mobile .mfn-field-value').val();

    if( val_desktop > 0 ) {
        var percent_d = 100 / parseInt(val_desktop);
        $editpanel.find('.mfn-form-row.mfn_field_desktop.query_item_default_width .mfn-field-value').val(percent_d+"%").trigger('change');
    }

    if( val_tablet > 0 ) {
        var percent_t = 100 / parseInt(val_tablet);
        $editpanel.find('.mfn-form-row.mfn_field_tablet.query_item_default_width .mfn-field-value').val(percent_t+"%").trigger('change');
    }

    if( val_mobile > 0 ) {
        var percent_m = 100 / parseInt(val_mobile);
        $editpanel.find('.mfn-form-row.mfn_field_mobile.query_item_default_width .mfn-field-value').val(percent_m+"%").trigger('change');
    }
}

// segmented options

$editpanel.on("click", '.panel:not(.panel-settings) .segmented-options.single-segmented-option li a', function(e) {
    e.preventDefault();

    let $li = $(this).closest('li');

    if( !$li.hasClass('active') ){
        $li.siblings('li').removeClass('active');
        $li.siblings('li').find('input').prop('checked', false);

        $li.addClass('active');
        $li.find('input').prop('checked', true).trigger('change');
    }

    if( $(this).closest('.mfn-modal').length ) return;

    let $editbox = $(this).closest('.mfn-form-row');
    let $editwrapper = $(this).closest('.mfn-element-fields-wrapper');

    if(!$editbox.hasClass('inline-style-input')){

        let it = $editbox.closest('.mfn-element-fields-wrapper').attr('data-element');
        let group = $editbox.closest('.mfn-element-fields-wrapper').attr('data-group');
        let val = $li.find('input').val();

        // lottie start
        if( $editbox.hasClass('lottie') ){
            var l_id = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');

            if( $editbox.hasClass('loop') ){
                if( val == 1 ){
                    iframe.window[l_id].loop = true;
                    iframe.window[l_id].play();
                }else{
                    iframe.window[l_id].loop = false;
                    iframe.window[l_id].stop();
                }
            }

            if( $editbox.hasClass('direction') ){
                iframe.window[l_id].setDirection(val);
                iframe.window['direction'+l_id] = parseInt(val);
                lottie_play();
            }
        }
        // lottie end

        // header icon count position

        if( $editbox.hasClass('icon_count_posv') ){
            if( val == '0' ){
                $editpanel.find('.panel-edit-item .header_icon.bottom .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.bottom_tablet .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.bottom_mobile .mfn-field-value').val('initial').trigger('change');
            }else{
                $editpanel.find('.panel-edit-item .header_icon.top .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.top_tablet .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.top_mobile .mfn-field-value').val('initial').trigger('change');
            }
        }

        if( $editbox.hasClass('icon_count_posh') ){
            if( val == '0' ){
                $editpanel.find('.panel-edit-item .header_icon.right .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.right_tablet .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.right_mobile .mfn-field-value').val('initial').trigger('change');
            }else{
                $editpanel.find('.panel-edit-item .header_icon.left .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.left_tablet .mfn-field-value').val('initial').trigger('change');
                $editpanel.find('.panel-edit-item .header_icon.left_mobile .mfn-field-value').val('initial').trigger('change');
            }
        }

        // watchchanges
        if( $editbox.hasClass('watchChanges') ){
            var id = $editbox.attr('id');
            mfnoptsinputs.getField(id, val, group);
        }

        // section type query loop
        if( $editbox.hasClass('section type') ){
            if( !val.length ){
                $content.find('.'+it+' .section_wrapper .mfn-queryloop-item-wrapper > div.wrap').unwrap();
                $('.mfn-element-fields-wrapper .query_type .mfn-field-value').val('').trigger('change');
                $('.mfn-element-fields-wrapper .query_post_type .mfn-field-value').val('').trigger('change');
                $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('').trigger('change');
                $content.find('.'+it).removeClass('mfn-looped-items');
                $('.mfn-element-fields-wrapper').removeClass('mfn-is-query-looped');
                $('.mfn-ui.mfn-editing-section .mfn-form .mfn-element-fields-wrapper').removeClass('mfn-is-query-looped');
            }else {
                if( !$content.find('.'+it+' .section_wrapper .mfn-queryloop-item-wrapper').length ){
                    $content.find('.'+it).addClass('mfn-looped-items');
                    $('.mfn-element-fields-wrapper').addClass('mfn-is-query-looped');
                    $content.find('.'+it+' .section_wrapper div.wrap').wrapAll( "<div class='mfn-queryloop-item-wrapper mfn-ql-item-default' />" );
                }
                $('.mfn-ui.mfn-editing-section .mfn-form .mfn-element-fields-wrapper').addClass('mfn-is-query-looped');
                $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('').trigger('change');
                $('.mfn-element-fields-wrapper .query_type .mfn-field-value').val('posts').trigger('change');
                $('.mfn-element-fields-wrapper .query_post_type .mfn-field-value').val('post').trigger('change');
                //re_render2( $content.find('.'+it).attr('data-uid'), 'section' );
            }
        }

        // wrap type query loop
        if( $editbox.hasClass('wrap type') ){
            if( !val.length ){
                $content.find('.'+it+' .mcb-wrap-inner .mfn-queryloop-item-wrapper > div.column').unwrap();
                $('.mfn-element-fields-wrapper .query_type .mfn-field-value').val('').trigger('change');
                $('.mfn-element-fields-wrapper .query_post_type .mfn-field-value').val('').trigger('change');
                $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('').trigger('change');
                $content.find('.'+it).removeClass('mfn-looped-items');
                $('.mfn-element-fields-wrapper').removeClass('mfn-is-query-looped');
                $('.mfn-ui.mfn-editing-section .mfn-form .mfn-element-fields-wrapper').removeClass('mfn-is-query-looped');
            }else{
                if( !$content.find('.'+it+' .mcb-wrap-inner .mfn-queryloop-item-wrapper').length ){
                    $content.find('.'+it+' .mcb-wrap-inner div.column').wrapAll( "<div class='mfn-queryloop-item-wrapper mfn-ql-item-default' />");
                    $content.find('.'+it).addClass('mfn-looped-items');
                }
                $('.mfn-ui.mfn-editing-section .mfn-form .mfn-element-fields-wrapper').addClass('mfn-is-query-looped');
                $('.mfn-element-fields-wrapper .query_type .mfn-field-value').val('posts').trigger('change');
                $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('').trigger('change');
                $('.mfn-element-fields-wrapper').addClass('mfn-is-query-looped');
                $('.mfn-element-fields-wrapper .query_post_type .mfn-field-value').val('post').trigger('change');
            }

            //re_render2( $content.find('.'+it).attr('data-uid'), 'wrap' );
        }

        if( $editbox.hasClass('query_display_style') ){
            if( val == 'masonry' ){
                $content.find('.'+it).addClass('mfn-looped-items-masonry');
                $content.find('.'+it+' .mfn-queryloop-item-wrapper').wrapAll( "<div class='mfn-query-loop-masonry' />");
                //queryLoopMasonry();
                iframe.queryLoopMasonry();
            }else if( !val.lenght ){
                if( $content.find('.'+it).hasClass('mfn-looped-items-masonry') ){
                    iframe.window.jQuery('.'+it+' .mfn-query-loop-masonry').isotope( 'destroy' );
                    $content.find('.'+it).removeClass('mfn-looped-items-masonry');
                    $content.find('.'+it+' .mfn-query-loop-masonry > .mfn-queryloop-item-wrapper').removeAttr('style').unwrap();
                }
            }
        }

        // query loop slider type

        /*if( $editbox.hasClass('query_display') ){
            $('.query_slider_columns .mfn-field-value').val('1').trigger('change');
        }*/

        // query loop slider arrows

        if( $editbox.hasClass('query_slider_arrows') ){
            if( val == '0' ){
                if( $content.find('.'+it+' .mfn-swiper-arrow').length ) $('.mfn-element-fields-wrapper .query_slider_arrows_style .segmented-options li:first-child a').trigger('click');
                $content.find('.'+it+' .mfn-swiper-arrow').remove();
                $content.find('.'+it).removeClass('mfn-arrows-standard mfn-arrows-overlay mfn-arrows-custom').addClass('mfn-arrows-hidden');
            }else{
                if( !$content.find('.'+it+' .mfn-swiper-arrow').length ) {
                    $content.find('.'+it+' > .section_wrapper, .'+it+' > .mcb-wrap-inner').append('<div class="swiper-button-next mfn-swiper-arrow" tabindex="0" role="button" aria-label="Next slide" aria-disabled="false"><i class="icon-right-open-big"></i></div><div class="swiper-button-prev mfn-swiper-arrow" tabindex="0" role="button" aria-label="Previous slide" aria-disabled="false"><i class="icon-left-open-big"></i></div>');
                    $('.mfn-element-fields-wrapper .query_slider_arrows_style .segmented-options li:first-child a').trigger('click');
                }
            }
        }

        if( $editbox.hasClass('query_slider_arrows_style') ){
            $content.find('.'+it).removeClass('mfn-arrows-standard mfn-arrows-overlay mfn-arrows-custom');
            if( val != 'custom' ) $('.mfn-element-fields-wrapper .arrows-custom-style .mfn-field-value').val('').trigger('change');
            if( val.length ){
                $content.find('.'+it).addClass('mfn-arrows-'+val);
            }else{
                $content.find('.'+it).addClass('mfn-arrows-standard');
            }
        }

        if( $editbox.hasClass('query_slider_dots') ){

            if( val == '0' ){
                if( $content.find('.'+it+' .swiper-pagination').length ) {
                    $('.mfn-element-fields-wrapper .query_slider_dots_style .segmented-options li:first-child a').trigger('click');
                    $content.find('.'+it+' .swiper-pagination').remove();
                }
                $content.find('.'+it).removeClass('mfn-dots-standard mfn-dots-overlay mfn-dots-custom').addClass('mfn-dots-hidden');
            }else{
                if( !$content.find('.'+it+' .swiper-pagination').length ) {
                    $content.find('.'+it+' > .section_wrapper, .'+it+' > .mcb-wrap-inner').append('<div class="swiper-pagination swiper-pagination-bullets"><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span><span class="swiper-pagination-bullet"></span><span class="swiper-pagination-bullet"></span></div>');
                    $('.mfn-element-fields-wrapper .query_slider_dots_style .segmented-options li:first-child a').trigger('click');
                }
            }
        }

        if( $editbox.hasClass('query_slider_dots_style') ){
            $content.find('.'+it).removeClass('mfn-dots-standard mfn-dots-overlay mfn-dots-custom');
            if( val != 'custom' ) $('.mfn-element-fields-wrapper .dots-custom-style .mfn-field-value').val('').trigger('change');
            if( val.length ){
                $content.find('.'+it).addClass('mfn-dots-'+val);
            }else{
                $content.find('.'+it).addClass('mfn-dots-standard');
            }
        }

        // header menu submenu icon
        if( $editbox.hasClass('header_menu submenu_icon_display') ){
            $content.find('.'+it+' .mfn-header-menu').addClass('mfn-menu-submenu-icon-off');
            if( val == 'on' )
                $content.find('.'+it+' .mfn-header-menu').removeClass('mfn-menu-submenu-icon-off');
        }

        // header menu icon align
        if( $editbox.hasClass('product_images zoom') ){
            updatePageOpt('mfn_template_product_image_zoom', val);
        }

        // product gallery arrows
        if( $editbox.hasClass('product_images thumbnail_arrows') ){
            $content.find('.'+it).removeClass('mfn-thumbnails-arrows-active');
            if( val.length ) $content.find('.'+it).addClass('mfn-thumbnails-arrows-active');
        }

        // image gallery image height
        if( $editbox.hasClass('image_gallery image_height') ){
            $content.find('.'+it+' .gallery').removeClass('mfn_custom_img_height');
            if( val.length ) $content.find('.'+it+' .gallery').addClass('mfn_custom_img_height');
        }

        // image gallery caption style
        if( $editbox.hasClass('image_gallery') && $editbox.hasClass('image_caption_style') ){
            $content.find('.'+it+' .gallery').removeClass('img_caption_overlay');
            if( val.length ) $content.find('.'+it+' .gallery').addClass('img_caption_overlay');
        }

        if( $editbox.hasClass('image_gallery') && $editbox.hasClass('layout') ){
            $content.find('.'+it+' .gallery').removeClass('equal-heights');

            if( val.length ){
                $content.find('.'+it+' .gallery').addClass('equal-heights');
                if( !$content.find('.'+it+' .gallery').hasClass('img_caption_overlay') ) $('.mfn-form-row.image_gallery.image_caption_style input[value="img_caption_overlay"]').siblings('a').trigger('click');
            }
        }

        // image gallery style
        if( $editbox.hasClass('image_gallery style') ){
            if( val == 'masonry' ) $('.image_gallery.layout .mfn-field-value[value=""]').siblings('a').trigger('click');
        }

        // header menu icon align
        if( $editbox.hasClass('header_menu icon_align') ){
            $content.find('.'+it+' .mfn-header-menu').removeClass('mfn-menu-icon-left mfn-menu-icon-right mfn-menu-icon-top');
            $content.find('.'+it+' .mfn-header-menu').addClass('mfn-menu-icon-'+val);
        }

        // mega menu icon align
        if( $editbox.hasClass('megamenu_menu icon_align') ){
            $content.find('.'+it+' .mfn-megamenu-menu').removeClass('mfn-mm-menu-icon-left mfn-mm-menu-icon-right mfn-mm-menu-icon-top');
            $content.find('.'+it+' .mfn-megamenu-menu').addClass('mfn-mm-menu-icon-'+val);
        }

        // header menu separator
        if( $editbox.hasClass('header_menu separator') ){
            $content.find('.'+it+' .mfn-header-menu').removeClass('mfn-menu-separator-on');
            if( val == 'on' ) $content.find('.'+it+' .mfn-header-menu').addClass('mfn-menu-separator-on');
        }

        // header icon cart/wislist count icon reset top/bottom left/right
        if( $editbox.hasClass('header_icon icon_count_posv') ){
            $editpanel.find('.header-icon-vert-count.header_icon .mfn-field-value').val('').trigger('change');
        }

        if( $editbox.hasClass('header_icon icon_count_posh') ){
            $editpanel.find('.header-icon-hori-count.header_icon .mfn-field-value').val('').trigger('change');
        }

        // greyscale
        if($editbox.hasClass('greyscale')){
            if(val == 0){
                $content.find('.'+it+' .element_classes').removeClass('greyscale');
            }else{
                $content.find('.'+it+' .element_classes').addClass('greyscale');
            }
        }

        // closeable header section

        if( $editbox.hasClass('section closeable') ){
            $content.find('.'+it+' .close-closeable-section').remove();
            $content.find('.'+it).removeClass('closeable-active');
            if( val == 1 ){
                $content.find('.'+it).append('<span class="close-closeable-section mfn-close-icon"><span class="icon">&#10005;</span></span>');
                $content.find('.'+it).addClass('closeable-active');
                if( !$content.find('.'+it).hasClass('close-button-right') && !$content.find('.'+it).hasClass('close-button-left') ){
                    $content.find('.'+it).addClass('close-button-left');
                }
            }

            // close-button-right closeable-active
        }

        // closeable header section

        if( $editbox.hasClass('section') && $editbox.hasClass('closeable-x') ){
            $content.find('.'+it).removeClass('close-button-right close-button-left');
            $content.find('.'+it).addClass('close-button-'+val);
        }

        // invert
        if($editbox.hasClass('invert')){
            if(val == 0){
                $content.find('.'+it+' .element_classes').removeClass('invert');
            }else{
                $content.find('.'+it+' .element_classes').addClass('invert');
            }
        }

        // reverse order
        if($editbox.hasClass('reverse_order') && $('.mfn-ui').hasClass('mfn-editing-wrap')){
            $edited_div.removeClass('column-reverse column-reverse-rows');
            if( val == '1' ){
                $edited_div.addClass('column-reverse');
            }else if( val == '2' ){
                $edited_div.addClass('column-reverse-rows');
            }
        }

        // reverse order sections
        if($editbox.hasClass('reverse_order') && $('.mfn-ui').hasClass('mfn-editing-section')){
            $edited_div.removeClass('wrap-reverse wrap-reverse-rows');
            if( val == '1' ){
                $edited_div.addClass('wrap-reverse');
            }else if( val == '2' ){
                $edited_div.addClass('wrap-reverse-rows');
            }
        }

        // olds

        // icon box 2 icon position
        if($editbox.hasClass('icon_box_2 icon_position') || $editbox.hasClass('header_icon icon_position') || $editbox.hasClass('header_burger icon_position') ){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-top mfn-icon-box-bottom mfn-icon-box-left mfn-icon-box-right');
            $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-'+val);
        }

        // icon box 2 icon position tablet
        if($editbox.hasClass('icon_box_2 icon_position_tablet') || $editbox.hasClass('header_icon icon_position_tablet') || $editbox.hasClass('header_burger icon_position_tablet') ){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-tablet-top mfn-icon-box-tablet-bottom mfn-icon-box-tablet-left mfn-icon-box-tablet-right');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-tablet-'+val);
        }

        // icon box 2 icon position mobile
        if($editbox.hasClass('icon_box_2 icon_position_mobile') || $editbox.hasClass('header_icon icon_position_mobile') || $editbox.hasClass('header_burger icon_position_mobile') ){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-mobile-top mfn-icon-box-mobile-bottom mfn-icon-box-mobile-left mfn-icon-box-mobile-right');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-mobile-'+val);
        }

        // icon box 2 icon align
        if($editbox.hasClass('icon_box_2 icon_align') || $editbox.hasClass('header_icon icon_align')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-center mfn-icon-box-start mfn-icon-box-end');
            $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-'+val);
        }

        // icon box 2 icon align tablet
        if($editbox.hasClass('icon_box_2 icon_align_tablet') || $editbox.hasClass('header_icon icon_align_tablet')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-tablet-center mfn-icon-box-tablet-start mfn-icon-box-tablet-end');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-tablet-'+val);
        }

        // icon box 2 icon align mobile
        if($editbox.hasClass('icon_box_2 icon_align_mobile') || $editbox.hasClass('header_icon icon_align_mobile')){
            $content.find('.'+it+' .mfn-icon-box').removeClass('mfn-icon-box-mobile-center mfn-icon-box-mobile-start mfn-icon-box-mobile-end');
            if( val ) $content.find('.'+it+' .mfn-icon-box').addClass('mfn-icon-box-mobile-'+val);
        }

        // icon box 2 title tag
        if($editbox.hasClass('icon_box_2 title_tag')){
            var ib2_title = $content.find('.'+it+' .mfn-icon-box .title').html();
            $content.find('.'+it+' .mfn-icon-box .title').replaceWith('<'+val+' class="title">'+ib2_title+'</'+val+'>');
        }

        // sticky wrapper

        if( $('.mfn-ui').hasClass('mfn-editing-wrap') && ( $editbox.hasClass('sticky') || $editbox.hasClass('tablet_sticky') || $editbox.hasClass('mobile_sticky') ) ){

            stickyWrap.reset();

            if( val == 1 ){
                $content.find('.'+it).addClass('sticky sticky-'+screen);
                $editwrapper.find('.mfn_field_'+screen+'.adv_alignself_wrap .positioning-options ul li:first-child a').trigger('click');
            }else{
                $content.find('.'+it).removeClass('sticky-'+screen);
            }

            stickyWrap.init();
        }

        // single product add to cart text-align
        if($editbox.hasClass('product_cart_button text-align')){
            $content.find('.'+it+' .mfn-product-add-to-cart').removeClass('mfn_product_cart_center mfn_product_cart_left mfn_product_cart_right mfn_product_cart_justify')
            if(val){
                $content.find('.'+it+' > div').addClass('mfn_product_cart_'+val);
            }
        }

        // text column align
        if($editbox.hasClass('column align')){
            $content.find('.'+it+' > div').removeClass('align_center align_left align_right align_justify');
            if(val){
                $content.find('.'+it+' > div').addClass('align_'+val);
            }
        }

        // quick fact align
        if($editbox.hasClass('quick_fact align')){
            $content.find('.'+it+' .quick_fact').removeClass('align_center align_left align_right').addClass('align_'+val);
        }

        // our team style
        if($editbox.hasClass('our_team') && $editbox.hasClass('style')){
            $content.find('.'+it+' .team').removeClass('team_circle team_vertical team_horizontal').addClass('team_'+val);
        }

        // offer thumb align
        if($editbox.hasClass('offer_thumb align')){
            $content.find('.'+it+' .desc_wrapper').removeClass('align_center align_left align_right align_justify').addClass('align_'+val);
        }

        // promo box image position
        if($editbox.hasClass('promo_box position')){
            $content.find('.'+it+' .promo_box_wrapper').removeClass('promo_box_right promo_box_left').addClass('promo_box_'+val);
        }

        // button icon position
        if($editbox.hasClass('widget-button icon_position')){
            $content.find('.'+it+' .button').removeClass('button_right button_left').addClass('button_'+val);
        }

        // counter type
        if($editbox.hasClass('counter') && $editbox.hasClass('type')){
            $content.find('.'+it+' .counter').removeClass('counter_horizontal counter_vertical').addClass('counter_'+val);
        }

        // promo box border
        if($editbox.hasClass('promo_box border')){
            if(val == 0){
                $content.find('.'+it+' .promo_box').removeClass('has_border').addClass('no_border');
            }else{
                $content.find('.'+it+' .promo_box').addClass('has_border').removeClass('no_border');
            }
        }

        // image border
        if($editbox.hasClass('image border')){
            if(val == 0){
                $content.find('.'+it+' .image_frame').removeClass('has_border').addClass('no_border');
            }else{
                $content.find('.'+it+' .image_frame').addClass('has_border').removeClass('no_border');
            }
        }

        // image align
        if($editbox.hasClass('image align')){
                $content.find('.'+it+' .image_frame').removeClass('alignleft alignright aligncenter');
            if(val){
                $content.find('.'+it+' .image_frame').addClass('align'+val);
            }
        }

        // trailer box orientation
        if($editbox.hasClass('trailer_box orientation')){
            $content.find('.'+it+' .trailer_box').removeClass('horizontal');
            if(val){
                $content.find('.'+it+' .trailer_box').addClass(val);
            }
        }

        // story box style
        if($editbox.hasClass('story_box') && $editbox.hasClass('style')){
            $content.find('.'+it+' .story_box').removeClass('vertical');
            if(val){
                $content.find('.'+it+' .story_box').addClass('vertical');
            }
        }

        // list style
        if($editbox.hasClass('list') && $editbox.hasClass('style')){
            $content.find('.'+it+' .list_item').removeClass('lists_1 lists_2 lists_3 lists_4').addClass('lists_'+val);
        }

        // icon box icon position
        if($editbox.hasClass('icon_box icon_position')){
            $content.find('.'+it+' .icon_box').removeClass('icon_position_left');
            if(val == 'left'){
                $content.find('.'+it+' .icon_box').addClass('icon_position_left');
            }
        }

        // blog teaser margin
        if($editbox.hasClass('blog_teaser margin')){
            $content.find('.'+it+' .blog-teaser').removeClass('margin-no');
            if(val == 0){
                $content.find('.'+it+' .blog-teaser').addClass('margin-no');
            }
        }

        // how it works border
        if($editbox.hasClass('how_it_works border')){
            if(val == 1){
                $content.find('.'+it+' .how_it_works').addClass('has_border').removeClass('no_border');
            }else{
                $content.find('.'+it+' .how_it_works').removeClass('has_border').addClass('no_border');
            }
        }

        // hover color align
        if($editbox.hasClass('hover_color align')){
            $content.find('.'+it+' .hover_color').removeClass('align_center align_left align_right align_justify');
            $content.find('.'+it+' .hover_color').addClass('align_'+val);
        }


        // button full width fullwidth
        if($editbox.hasClass('widget-button full_width')){
            $content.find('.'+it+' .button').removeClass('button_full_width');
            if(val == 1){
                $content.find('.'+it+' .button').addClass('button_full_width');
            }
        }

        // button size
        if($editbox.hasClass('widget-button') && $editbox.hasClass('size')){
            $content.find('.'+it+' .button').removeClass('button_size_1 button_size_2 button_size_3 button_size_4');
            $content.find('.'+it+' .button').addClass('button_size_'+val);
        }

        // blog more
        if($editbox.hasClass('blog more')){
            $content.find('.'+it+' .posts_group').removeClass('hide-more');
            if(val == 0){
                $content.find('.'+it+' .posts_group').addClass('hide-more');
            }
        }

        // blog more
        if($editbox.hasClass('blog margin')){
            $content.find('.'+it+' .posts_group').removeClass('margin');
            if(val == 1){
                $content.find('.'+it+' .posts_group').addClass('margin');
            }
        }

        // mobile column text align
        if($editbox.hasClass('column align-mobile')){
            $content.find('.'+it+' > div').removeClass('mobile_align_center mobile_align_left mobile_align_right mobile_align_justify');
            if(val){
                $content.find('.'+it+' > div').addClass('mobile_align_'+val);
            }
        }

    }

});

// header icon desc / empty desc

$editpanel.on('keyup paste change', '.mfn-element-fields-wrapper .header_icon.desc .mfn-field-value', function() {
    var val = $(this).val();
    if( val.length ){
        $edited_div.find('.mfn-icon-box').removeClass('mfn-icon-box-empty-desc');
    }else{
        $edited_div.find('.mfn-icon-box').addClass('mfn-icon-box-empty-desc');
    }
});

// multiple fields

$editpanel.on('keyup', '.multiple-inputs .field input', function() {
    var $editbox = $(this).closest('.multiple-inputs');

    if($editbox.hasClass('isLinked')){
        var thisval = $(this).val();
        $editbox.find('.disableable input').val(thisval);
    }

}).on('change', '.multiple-inputs .field input:not(.readonly)', function() {
    var $input = $(this);
    var rwd = 'desktop';
    var $editbox = $input.closest('.multiple-inputs');
    var $box = $input.closest('.mfn-vb-formrow');
    var val = $input.val();

    if( $box.hasClass('mfn_field_tablet') ){
        rwd = 'tablet';
    }else if( $box.hasClass('mfn_field_mobile') ){
        rwd = 'mobile';
    }

    var units_check = false;

    if( val.length && $input.hasClass('numeral') ){
        $.each( units, function( i, el ) {
            if( val == 'initial' || val == 'auto' || val.includes(el) ){
                units_check = true;
            }
        });

        if(units_check == false){
            val += "px";
            $input.val(val);
        }
    }

    if( $editbox.hasClass('isLinked') ) {
        $editbox.find('.disableable input').each(function() {
            $(this).val(val).trigger('change');
            if( !$box.hasClass('pageoption') ) {
                getFieldChange($(this));
            }
        });

        if( $box.hasClass('pageoption') ) {
            setTimeout(function() {
                $editbox.find('.field:last-child input').trigger('change');
            },400);
        }
    }

    if(!$editbox.hasClass('separated-fields')){
        updatePseudoField($editbox);
    }else{
        historyStorage.add();
    }

    if($content.find('.vb-item[data-uid='+edited_item.uid+'] .slick-initialized').length){
        setTimeout(function() {
        $content.find('.vb-item[data-uid='+edited_item.uid+'] .slick-initialized').each(function() {
            $(this).slick('setPosition');
        });
        },300);
    }

    setTimeout(function() {
        loopAllStyleFields(edited_item.uid);
    }, 100);

});

$editpanel.on('change', '.mfn-element-fields-wrapper .header_menu.justify-content .preview-justify-contentinput', function() {
    var val = $(this).val();
    if( val == 'center' || val == 'flex-end' || val == 'flex-start' ){
        $('.mfn-element-fields-wrapper .header_menu.flex-grow .preview-flex-growinput').val('unset').trigger('change');
    }
});

$editpanel.on('change', '.mfn-element-fields-wrapper .header_menu.justify-content_tablet .preview-justify-content_tabletinput', function() {
    var val = $(this).val();
    if( val == 'center' || val == 'flex-end' || val == 'flex-start' ){
        $('.mfn-element-fields-wrapper .header_menu.flex-grow_tablet .preview-flex-grow_tabletinput').val('unset').trigger('change');
    }
});

$editpanel.on('change', '.mfn-element-fields-wrapper .custom-element-position .mfn-field-value', function() {
    var val = $(this).val();
    if( !val.length || val == 'unset' ){
        $content.find('.'+edited_item.uid).removeClass('mfn-column-absolute');
        if( $('.mfn-element-fields-wrapper .mfn_field_desktop.custom-abs-offset-values').length ){
            $('.mfn-element-fields-wrapper .mfn_field_'+screen+'.custom-abs-offset-values .mfn-field-value').val('').trigger('change');
        }else{
            $('.mfn-element-fields-wrapper .custom-abs-offset-values .mfn-field-value').val('').trigger('change');
        }
    }else if(val == 'absolute'){
        $content.find('.'+edited_item.uid).addClass('mfn-column-absolute');
    }
});



$editpanel.on('change', '.mfn-element-fields-wrapper .header_menu.justify-content_mobile .preview-justify-content_mobileinput', function() {
    var val = $(this).val();
    if( val == 'center' || val == 'flex-end' || val == 'flex-start' ){
        $('.mfn-element-fields-wrapper .header_menu.flex-grow_mobile .preview-flex-grow_mobileinput').val('unset').trigger('change');
    }
});

$editpanel.on('click', '.multiple-inputs a.link', function(e) {
    e.preventDefault();
    var $editbox = $(this).closest('.multiple-inputs');

    historyAllow = false;

    if($editbox.hasClass('isLinked')){
        $editbox.removeClass('isLinked');
        $editbox.find('.disableable input').removeClass('readonly').removeAttr('readonly');
    }else{
        var thisval = $editbox.find('.form-control .field').first().find('input').val();
        $editbox.addClass('isLinked');
        $editbox.find('.disableable input').addClass('readonly').attr('readonly', 'readonly');
        $editbox.find('.disableable input').val(thisval).trigger('change');

        if(!$editbox.hasClass('separated-fields')){
            updatePseudoField($editbox);
        }
    }

    historyAllow = true

});

$editpanel.on('change', '.mfn-element-fields-wrapper .query_type .mfn-field-value', function() {
    var val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    if( val == 'terms' ){
        $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('category').trigger('change');
        $('.mfn-element-fields-wrapper .query_post_type .mfn-field-value').val('').trigger('change');
    }else if( val == 'posts' ){
        $('.mfn-element-fields-wrapper .query_post_type .mfn-field-value').val('post').trigger('change');
        $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('').trigger('change');
    }
});

$editpanel.on('change', '.browse-image:not(.multi) .mfn-field-value', function() {
    var val = $(this).val();
    var imgInput = $(this);

    if( val.length ){
        uploader.itemsUpdate(val, imgInput);
    }
});

$editpanel.on('change', '.preview-height_switcherinput', function(e) {
    let val = $(this).val();
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let $el = $edited_div;

    if(val == 'full-screen') {
        $el.addClass('full-screen');
    }else{
        $el.removeClass('full-screen');
    }

    if( val == 'default' && screen == 'desktop' ){
        $(this).closest('.mfn-element-fields-wrapper').find('.modalbox-card-advanced .mfn_field_desktop.height .mfn-field-value').val('').trigger('change');
    }
    if( val == 'default' && screen == 'tablet' ){
        $(this).closest('.mfn-element-fields-wrapper').find('.modalbox-card-advanced .mfn_field_tablet.height_tablet .mfn-field-value').val('').trigger('change');
        $('.mfn-element-fields-wrapper .mfn_field_tablet .preview-height_tabletinput').val('').trigger('change');
    }
    if( val == 'default' && screen == 'mobile' ){
        $(this).closest('.mfn-element-fields-wrapper').find('.modalbox-card-advanced .mfn_field_mobile.height_mobile .mfn-field-value').val('').trigger('change');
        $('.mfn-element-fields-wrapper .mfn_field_mobile .preview-height_mobileinput').val('').trigger('change');
    }
});

$editpanel.on('change', '.width_switcher .mfn-field-value', function(e) {
    let val = $(this).val();
    let uid = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');

    $content.find('.'+uid).removeClass('mfn-item-inline custom-width full-width default-width mfn-item-custom-width');

    if( $content.find('.'+uid).hasClass('mcb-section')){
         $content.find('.'+uid).addClass(val+'-width');
    }else{
        if(val == 'inline'){
             $content.find('.'+uid).addClass('mfn-item-inline');
        }else if(val == 'custom'){
            $content.find('.'+uid).addClass('mfn-item-custom-width');
        }
    }

    if( val == 'default' || val == 'inline' ){

        if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .inline-style-input.max-width .mfn-form-input').length ){
            $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .inline-style-input.max-width .mfn-form-input').val('').trigger('change');
        }

        if( screen == 'desktop' ){
            if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_desktop.advanced_flex.inline-style-input .mfn-field-value').length ){
                $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_desktop.advanced_flex.inline-style-input .mfn-field-value').val('').trigger('change');
            }
        }else if( screen == 'tablet' ){
            if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_tablet.advanced_flex.inline-style-input .mfn-field-value').length ){
                $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_tablet.advanced_flex.inline-style-input .mfn-field-value').val('').trigger('change');
            }
        }else if( screen == 'mobile' ){
            if( $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_mobile.advanced_flex.inline-style-input .mfn-field-value').length ){
                $('.mfn-ui .panel-edit-item .mfn-form .modalbox-card-advanced .mfn_field_mobile.advanced_flex.inline-style-input .mfn-field-value').val('').trigger('change');
            }
        }
    }
    
    setTimeout(function() {
        setSizeLabels();
    }, 200);

});

$editpanel.on('change', '.mfn-layout-modifier .mfn-field-value', function() {
    let uid = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    reLayoutIsotope( uid );
});

function reLayoutIsotope( uid ){
    if( !$content.find('.'+uid+' .masonry').length ) return;
    setTimeout(function() {
        iframe.jQuery('.'+uid+' .masonry').isotope('layout'); // isotope
    }, 200);

    setTimeout(runSorting, 300);
}



$editpanel.on('change', '.mfn-vb-formrow.bgposopt select', function() {

    if( $(this).val() != 'custom' ){
        $('.mfn-vb-formrow.mfn-custom-bg-pos.mfn_field_'+screen+' input').val('').trigger('change');
    }

});

$editpanel.on('change', '.mfn-vb-formrow.custombgsize select', function() {

    if( $(this).val() != 'custom' ){
        $('.mfn-vb-formrow.mfn-custom-bg-size.mfn_field_'+screen+' input').val('').trigger('change');
    }

});

$editpanel.on('click', '.multiple-inputs a.inset', function(e) {
    e.preventDefault();
    var $editbox = $(this).closest('.multiple-inputs');
    if($editbox.hasClass('isInset')){
        $editbox.removeClass('isInset');
        $editbox.find('input.boxshadow-inset').val('');
    }else{
        var thisval = $editbox.find('.field input').val();
        $editbox.addClass('isInset');
        $editbox.find('input.boxshadow-inset').val('inset');
    }
    updatePseudoField($editbox);
});

// animation

$editpanel.on('change', '.preview-animateinput', function(){
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let $edited_box = $edited_div;
    let val = $(this).val();

    $edited_box.removeClass('animate fadeIn fadeInUp fadeInDown fadeInLeft fadeInRight fadeInUpLarge fadeInDownLarge fadeInLeftLarge fadeInRightLarge zoomIn zoomInUp zoomInDown zoomInLeft zoomInRight zoomInUpLarge zoomInDownLarge zoomInLeftLarge bounceIn bounceInUp bounceInDown bounceInLeft bounceInRight');
    if(val.length){
        $edited_box.addClass('animate '+val);
    }
});

// mask shape

function maskShapeGetAttrs( el ) {
    const formInputVal = $(el).find('.mfn-form-select').val();
    const sectionName = $(el).closest('.mfn-element-fields-wrapper').attr('data-element');
    const sectionDom = $("iframe#mfn-vb-ifr").contents().find('body').find('.'+sectionName);

    return {formInputVal, sectionName, sectionDom};
}

let maskShapeConditionalArray = [];
function maskShapeHideChildrenConditional( el ) {
    const isMaskShapeEnabled = "None" !== $(el).find('[data-name="mask_shape_type"] select option:selected').text();

    //Hide

    if ( !isMaskShapeEnabled ) {
        maskShapeConditionalArray = [];
        let isPositionEnabled = "Custom" === $(el).find('[data-name="mask_shape_position"] select option:selected').text();
        let isSizeEnabled = "Custom" === $(el).find('[data-name="mask_shape_size"] select option:selected').text() ;

        if ( isPositionEnabled ) {
            const hiddenInputX = $(el).find('[data-name="-webkit-mask-position-x"]');
            const hiddenInputY = $(el).find('[data-name="-webkit-mask-position-y"]');

            maskShapeConditionalArray.push(hiddenInputX, hiddenInputY);
        }

        if ( isSizeEnabled ) {
            const hiddenInput = $(el).find('[data-name="-webkit-mask-size"]');
            maskShapeConditionalArray.push(hiddenInput);
        }

        setTimeout(function(){
            maskShapeConditionalArray.forEach(element => {
                $(element).removeClass('conditionally-show');
                $(element).addClass('conditionally-hide');
            });
        }, 0 )

        return;
    }

    //Display

    maskShapeConditionalArray.forEach(element => {
        $(element).addClass('conditionally-show');
        $(element).removeClass('conditionally-hide');
    });

    return;

}

$editpanel.on('change', '.heading.background-image:not(.activeif-background_switcher_adv)', function() {
    const formInputVal = $(this).find('.mfn-form-input').val();
    const {sectionDom } = maskShapeGetAttrs($(this));
    const titleDom = $(sectionDom).find('.title');

    if(formInputVal.length > 0){
        $(titleDom).addClass('mfn-mask-shape');
    } else {
        $(titleDom).removeClass('mfn-mask-shape');
    }
})

$editpanel.on('change', '.mask_shape_type', function() {
    const {formInputVal, sectionDom } = maskShapeGetAttrs($(this));
    const availableStyles = ['circle', 'blob', 'blob-2', 'brush', 'brush-2', 'cross', 'irregular-circle', 'stain', 'triangle', 'custom'];
    const itemName = sectionDom.hasClass('column_image') ? 'image' : 'video';
    const shapeContainer = itemName === 'image' ? $(sectionDom).find('.image_frame') : $(sectionDom).find('.content_video');
    const parentContainer = $(this).closest('.mfn-element-fields-wrapper');

    availableStyles.forEach(style => {
        $( shapeContainer ).removeClass(style);
    })

    if(parseInt(formInputVal) == 0 ){
        if( shapeContainer.hasClass('mfn-mask-shape') ){
            $(shapeContainer).removeClass('mfn-mask-shape');
        }

        maskShapeHideChildrenConditional(parentContainer);
    } else {
        if( !shapeContainer.hasClass('mfn-mask-shape') ){
            $(shapeContainer).addClass('mfn-mask-shape');
        }

        maskShapeHideChildrenConditional(parentContainer);
        $( shapeContainer ).addClass( formInputVal );
    }
})

$editpanel.on('change', '.mask_shape_size', function() {
    const {formInputVal, sectionName, sectionDom } = maskShapeGetAttrs($(this));

    //itemName variable must be here, because heading does not have custom size/position
    const itemName = sectionDom.hasClass('column_image') ? 'image' : 'video';
    const shapeContainer = itemName === 'image' ? $(sectionDom).find('img') : $(sectionDom).find('video, iframe');

    if(formInputVal !== 'custom' ){
        shapeContainer.css('mask-size', formInputVal);
    } else {
        var sizeAppended = $(this).closest('.mfn-element-fields-wrapper').find('.-webkit-mask-size .mfn-sliderbar-value').val();
        shapeContainer.css('mask-size', `${sizeAppended}%`);
    }
})

$editpanel.on('change', '.mask_shape_position', function() {
    const {formInputVal, sectionName, sectionDom } = maskShapeGetAttrs($(this));

    //itemName variable must be here, because heading does not have custom size/position
    const itemName = sectionDom.hasClass('column_image') ? 'image' : 'video';
    const shapeContainer = itemName === 'image' ? $(sectionDom).find('img') : $(sectionDom).find('video, iframe');

    if(formInputVal !== 'custom' ){
        const positions = formInputVal.split(' ');
        shapeContainer.css('mask-position-y', positions[0]);
        shapeContainer.css('mask-position-x', positions[1]);
    }
})

// shape divider

function shapeDividerGetAttrs( el ) {
    const sectionName = $(el).closest('.mfn-element-fields-wrapper').attr('data-element');
    const sectionDom = $content.find('.'+sectionName);

    const inputName = $(el).attr('data-name');
    const inputValue = $(el).find('.mfn-field-value').val();
    const checkboxValue = $(el).find('li.active input[type="checkbox"]').val();

    const shapeDividerPosition = inputName.match(/top|bottom/).toString();
    const shapeDividerDom = $(sectionDom).find('.mfn-shape-divider[data-name="'+ shapeDividerPosition +'"]');

    let invertValue = $(el).siblings('.shape_divider_invert_'+shapeDividerPosition).find('li.active input[type="checkbox"]').val();

    let shapeDividerOptions = inputName.match(/flip|bring_front/);
    if (shapeDividerOptions != null){
      shapeDividerOptions = shapeDividerOptions.toString();
    }

    return {inputName, inputValue, checkboxValue, sectionName, sectionDom, shapeDividerPosition, shapeDividerDom, shapeDividerOptions, invertValue};
}

$editpanel.on('change', '.shape_divider_type_top, .shape_divider_type_bottom', function() {
    const { inputValue, shapeDividerPosition, sectionDom, invertValue } = shapeDividerGetAttrs($(this));

    let { shapeDividerDom } = shapeDividerGetAttrs($(this));
    let svgLocation = $(shapeDividerDom).find('svg');
    let currentTabView = $('.panel-edit-item');

    // empty value

    if( ! inputValue ){
      svgLocation.html('<path></path>');
      return;
    }

    // invert

    let invertValSet = currentTabView.find('.shape_divider_invert_'+ shapeDividerPosition +' li.active input').val();
    invertValSet = parseInt(invertValSet);

    let key = 'svg';
    if( invertValSet && ( 'invert' in mfnvbvars.shape_dividers[inputValue] ) ) {
      key = 'invert';
    } else {
      invertValSet = 0;
    }

    shapeDividerDom.attr('data-invert',invertValSet);

    // viewbox

    let viewbox = '0 0 1200 120';

    if( 'viewbox' in mfnvbvars.shape_dividers[inputValue] ){
      viewbox = mfnvbvars.shape_dividers[inputValue]['viewbox'];
    }

    svgLocation.attr('viewBox',viewbox);

    // get path

    const rand = Math.random().toString(36).substring(8);
    const regex = /mfn-uid-/g;
    let pathVal = mfnvbvars.shape_dividers[inputValue][key].replace( regex, 'mfn-uid-'+ rand );

    svgLocation.html(pathVal);
});

$editpanel.on('change', '.shape_divider_flip_top, .shape_divider_invert_top, .shape_divider_bring_front_top, .shape_divider_flip_bottom, .shape_divider_invert_bottom, .shape_divider_bring_front_bottom', function() {
    const { shapeDividerDom, inputName, checkboxValue, shapeDividerPosition } = shapeDividerGetAttrs($(this));
    let svgLocation = $(shapeDividerDom).find('svg');
    let toChange;

    switch(inputName){

      case 'shape_divider_flip_'+ shapeDividerPosition:
        $(shapeDividerDom).attr('data-flip', checkboxValue); //0 or 1
        break;

      case 'shape_divider_invert_'+ shapeDividerPosition:
        svgLocation = $(shapeDividerDom).closest('.be-custom-shape');

        $(shapeDividerDom).attr('data-invert', checkboxValue); //0 or 1

        //Invert is chaning the "D" path, so we need to update it
        const typeSwitch = $(this).siblings('div[data-name="shape_divider_type_'+shapeDividerPosition+'"]');
        $(typeSwitch).trigger('change');
        break;

      case 'shape_divider_bring_front_'+ shapeDividerPosition:
        $(shapeDividerDom).attr('data-bring-front', checkboxValue); //0 or 1

        $(svgLocation).css('z-index', toChange);
        break;

    }
});

// decoration svgs

$editpanel.on('change', '.preview-dividerinput', function() {
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();
    if($content.find('.'+it+' .section-divider').length){
        $content.find('.'+it+' .section-divider').removeClass('circle up square triangle triple-triangle down').addClass(val);
    }else if(val != ''){
        $edited_div.append('<div class="section-divider '+val+'"></div>');
    }
});

// segmented options multi segmented

$editpanel.on('click', '.multiple-segmented-options.segmented-options ul li a', function(e) {
    e.preventDefault();

    let $editbox = $(this).closest('.mfn-form-row');
    let $li = $(this).closest('li');
    let it = $editbox.closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $li.find('input').val();
    let id = $li.find('input').attr('name');

    if($li.hasClass('active')){
        $li.find('input').prop('checked', false);
        $li.removeClass('active');
        if( $editbox.hasClass('header_icon_desc_visibility') ){
            $edited_div.find('.mfn-header-icon-box .desc-wrapper').removeClass(val);
        }else{
            $edited_div.removeClass(val);
        }
    }else{

        // max 2/3 in responsive visibility
        if( $editbox.hasClass('visibility') && $editbox.find('ul li.active').length == 2 ){
            return;
        }

        $li.addClass('active');
        $li.find('input').prop('checked', true);
        if( $editbox.hasClass('header_icon_desc_visibility') ){
            $edited_div.find('.mfn-header-icon-box .desc-wrapper').addClass(val);
        }else{
            $edited_div.addClass(val);
        }
    }

    var value = '';

    $('li input:checked', $editbox).each(function() {
        value = value + ' ' + $(this).val();
    });

    if( value.length ){
        edited_item['attr'][id] = value;
    }else{
        delete(edited_item['attr'][id]);
    }

    /*var value = '';

    $('li input:checked', $editbox).each(function() {
        value = value + ' ' + $(this).val();
    });

    $hiddeninput.val(value).trigger('change');*/
});

// gradient input change

$editpanel.on('change', '.mfn-vb-formrow.gradient .mfn-form-control', function() {
    let $editbox = $(this).closest('.mfn-vb-formrow');
    gradientValue($editbox);
});


// pseudo checkbox

$editpanel.on('click', '.checkboxes ul li', function() {

    let $input = $(this).find('input');
    let $editbox = $(this).closest('.mfn-form-row');
    let input_name = $input.attr('name');
    let val = $input.val();

    let windowH = $(window).height() || 0;

    if($(this).hasClass('active')){
        $input.prop('checked', false).trigger('change');
        $(this).removeClass('active');
        if( $editbox.closest('.mfn-element-fields-wrapper').length ) $edited_div.removeClass(val);

        if($editbox.hasClass('mfn-type-section') && val == 'full-screen'){
            let it = $editbox.closest('.mfn-element-fields-wrapper').attr('data-element');
            $edited_div.css({'min-height': '50px'});
            $content.find('.'+it+' .section_wrapper').css({'padding-top': 0, 'padding-bottom': 0});
        }

    }else{
        $(this).addClass('active');
        $input.prop('checked', true).trigger('change');
        if( $editbox.closest('.mfn-element-fields-wrapper').length ) $edited_div.addClass(val);
    }

    if( $editbox.find( '.checkboxes.pseudo' ).length ){
        var value = '';

        $('li input:checked', $editbox).each(function() {
            value = value + ' ' + $(this).val();
        });

        edited_item['attr'][input_name] = value;
        $('.value', $editbox).val(value).trigger('change');
    }else if( typeof edited_item['attr'] !== 'undefined' && typeof edited_item['attr'][input_name] !== 'undefined' ){
        //$input.trigger('change');
        delete(edited_item['attr'][input_name])
    }

});

// radio img

$editpanel.on('click', '.visual-options ul li a', function(e) {
    e.preventDefault();

    let $li = $(this).closest('li');
    let $editbox = $li.closest('.mfn-form-row');
    let $edit_wrapper = $li.closest('.mfn-element-fields-wrapper');

    let it = $edit_wrapper.attr('data-element');
    let val = $li.find('input').val();

    if(!$li.hasClass('active')){
        $editbox.find('li').removeClass('active');
        $editbox.find('li').find('input').prop('checked', false);

        $li.addClass('active');
        $li.find('input').prop('checked', true).trigger('change');
    }

    if( $editbox.hasClass('themeoption layout') ){
        // themeoption layout
        $content.find('body').removeClass('layout-boxed layout-full-width').addClass('layout-'+val);
    }

    if( $editbox.hasClass('themeoption style') ){
        // themeoption style
        $content.find('body').removeClass('style-default style-simple');
        if( val.length ){
            $content.find('body').addClass('style-simple');
        }else{
            $content.find('body').addClass('style-default');
        }
    }

    if( $editbox.hasClass('popup_position') ){
        $editbox.find('input[name="popup_position"]').each(function() {
            $content.find('.mfn-popup-tmpl').removeClass('mfn-popup-tmpl-'+$(this).val());
        });
        $content.find('.mfn-popup-tmpl').addClass('mfn-popup-tmpl-'+val);
    }

    if( $editbox.hasClass('sidemenu_position') ){
        $content.find('.mfn-sidemenu-tmpl').removeClass('mfn-sidemenu-align-right mfn-sidemenu-align-left');
        if( val.length ){
            $content.find('.mfn-sidemenu-tmpl').addClass('mfn-sidemenu-align-'+val);
        }else{
            $content.find('.mfn-sidemenu-tmpl').addClass('mfn-sidemenu-align-left');
        }

    }


    if( $editbox.hasClass('watchChanges') ){
        var id = $editbox.attr('id');
        mfnoptsinputs.getField(id, val);
    }

});



$editpanel.on('change', '.panel-view-options .option.popup_close_button_active .mfn-field-value', function() {
    let val = $(this).val();
    $content.find('.mfn-popup-tmpl').removeClass('mfn-popup-tmpl-close-button-hidden');

    if( val == '' ){
        $content.find('.mfn-popup-tmpl').addClass('mfn-popup-tmpl-close-button-hidden');
    }

});

$editpanel.on('change', '.panel-view-options .option.sidemenu_close_button_active .mfn-field-value', function() {
    let val = $(this).val();
    $content.find('.mfn-sidemenu-tmpl').removeClass('mfn-sidemenu-closebutton-hidden mfn-sidemenu-closebutton-active');

    if( val.length ){
        $content.find('.mfn-sidemenu-tmpl').addClass('mfn-sidemenu-closebutton-active');
    }else{
        $content.find('.mfn-sidemenu-tmpl').addClass('mfn-sidemenu-closebutton-hidden');
    }

});

$editpanel.on('change', '.panel-view-options .option.popup_width .mfn-field-value', function() {
    let val = $(this).val();
    $content.find('.mfn-popup-tmpl').removeClass('mfn-popup-tmpl-full-width mfn-popup-tmpl-width-default mfn-popup-tmpl-custom-width');

    if( val.length ){
        $content.find('.mfn-popup-tmpl').addClass('mfn-popup-tmpl-'+val);
    }else{
        $content.find('.mfn-popup-tmpl').addClass('mfn-popup-tmpl-width-default');
    }

});

$editpanel.on('change', '.panel-view-options .option.popup_close_button_align .mfn-field-value', function() {
    let val = $(this).val();
    $content.find('.mfn-popup-tmpl').removeClass('mfn-popup-close-button-right mfn-popup-close-button-left');

    if( val.length ){
        $content.find('.mfn-popup-tmpl').addClass('mfn-popup-close-button-'+val);
    }else{
        $content.find('.mfn-popup-tmpl').addClass('mfn-popup-close-button-right');
    }

});

$editpanel.on('change', '.panel-view-options .sidemenu_close_button_align .mfn-field-value', function() {
    let val = $(this).val();

    $content.find('.mfn-sidemenu-tmpl').removeClass('mfn-sidemenu-close-button-left mfn-sidemenu-close-button-right');
    if( val.length ){
        $content.find('.mfn-sidemenu-tmpl').addClass('mfn-sidemenu-close-button-'+val);
    }else{
        $content.find('.mfn-sidemenu-tmpl').addClass('mfn-sidemenu-close-button-right');
    }

});

function onOpenEditForm() {

    if($('.mfn-ui').hasClass('mfn-sidebar-hidden-footer')) $('.mfn-ui').removeClass('mfn-sidebar-hidden-footer');

    /**
     * Query loop
    * */

    if( edited_item.jsclass == 'wrap' || edited_item.jsclass == 'section' ){
        //$('.mfn-element-fields-wrapper .mfn-form-row.type .segmented-options li:first-child a').trigger('click');

        //console.log(edited_item);

        if( typeof edited_item['attr']['type'] === 'undefined' || edited_item['attr']['type'] == '' ){

            $('.mfn-element-fields-wrapper .mfn-form-row.query_type .mfn-field-value').val('');
            $('.mfn-element-fields-wrapper .mfn-form-row.query_post_type .mfn-field-value').val('');
            $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('');

        }else if( ( typeof edited_item['attr']['query_type'] === 'undefined' || edited_item['attr']['query_type'] == 'terms' ) ) {

            $('.mfn-element-fields-wrapper .mfn-form-row.query_post_type .mfn-field-value').val('');

        }else if( typeof edited_item['attr']['query_type'] === 'undefined' || edited_item['attr']['query_type'] == 'posts' ) {
             $('.mfn-element-fields-wrapper .query_terms_taxonomy .mfn-field-value').val('');
        }

    }

    /**
     * Sidebar nav trigger click
    * */

    if( $editpanel.find('.panel-edit-item .mfn-form .mfn-sidebar-fields-tabs ul.mfn-sft-nav').length ){
        $editpanel.find('.panel-edit-item .mfn-form .mfn-sidebar-fields-tabs ul.mfn-sft-nav').each(function() {
            $(this).find('li:first-child a').trigger('click');
        });
    }

    /**
     * Deprecated hide
    * */

    if( $('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated').length ){
        /*$('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated').each(function() {
            if( $(this).find('.mfn-field-value').length && !$(this).find('.mfn-field-value').val().length ) $(this).remove();
        });*/
        if( !$('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated .mfn-field-value').length ) $('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow.mfn-deprecated').remove();
    }

    //$('.panel-edit-item .mfn-element-fields-wrapper .mfn-vb-formrow .checkboxes.pseudo .mfn-deprecated:not(.active)').remove();

    if( $('.panel-edit-item .mfn-element-fields-wrapper .browse-image.multi .gallery-container li').length ){
        uploader.sortable();
    }

    /**
     * Slider bar
    * */

    if( $('.mfn-form .mfn-element-fields-wrapper .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').length ){
        $('.mfn-form .mfn-element-fields-wrapper .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').each(function() {
            sliderInput.init($(this));
        });
    }

    /**
     * Mask shapes
     */

    const getMaskShapeParents = $('.panel-edit-item').find('[data-item="image"], [data-item="video"]');
    if( getMaskShapeParents.length ) {
      maskShapeHideChildrenConditional( getMaskShapeParents );
    };

}



$editpanel.on('click', '.mfn-form-row .color-picker .form-control .color-picker-vb:not(.mfn-initialized)', function() {
    if( !$(this).hasClass('mfn-initialized') ){
        $(this).addClass('mfn-initialized');

        var $this_input = $(this);

        var cp_selector = 'color-picker-vb-'+getUid();
        var $edit_field = $(this).closest('.mfn-form-row');
        var $edit_wrapper = $(this).closest('.mfn-element-fields-wrapper');
        var element = $edit_wrapper.attr('data-element');

        var css_style = $edit_field.attr('data-name');
        var css_path = $edit_field.attr('data-csspath');

        if( $edit_field.hasClass('themeoption') ){
            css_style = $edit_field.attr('data-style');
        }

        var default_color = $this_input.val().length ? $this_input.val() : '#000';

        $this_input.addClass(cp_selector+' mfn-initialized');
        const inputElement = document.querySelector( '.'+cp_selector );

        const mfnPickr = Pickr.create({
            el: inputElement,
            theme: 'nano',
            useAsButton: true,
            defaultRepresentation: 'HEX',
            default: default_color,
            comparison: true,
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(103, 58, 183, 1)',
                'rgba(63, 81, 181, 1)',
                'rgba(33, 150, 243, 1)',
                'rgba(3, 169, 244, 1)',
                'rgba(0, 188, 212, 1)',
                'rgba(0, 150, 136, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(139, 195, 74, 1)',
                'rgba(205, 220, 57, 1)',
                'rgba(255, 235, 59, 1)',
                'rgba(255, 193, 7, 1)'
            ],
            components: {
                palette: true,
                preview: true,
                opacity: true,
                hue: true,
                interaction: {
                    hex: false,
                    rgba: false,
                    hsla: false,
                    hsva: false,
                    cmyk: false,
                    input: true,
                    clear: true,
                    save: true
                }
            },
        }).on('init', (color, instance) => {
            mfnPickr.show();
        }).on('show', (color, instance) => {
            if( $this_input.val().length && $this_input.val().includes('#') && $this_input.val() != color.toHEXA().toString(0) ) {
                mfnPickr.setColor($this_input.val());
                mfnPickr.show();
            }
            $('.sidebar-wrapper').addClass('mfn-vb-sidebar-overlay');
        }).on('hide', (color, instance) => {
            if( $this_input.val().length ) mfnPickr.setColor($this_input.val());
            $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');

            if(css_path && !$edit_field.hasClass('fancy_divider')){
                setTimeout(function() {
                    changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, 'remove');
                }, 50);
            }

        }).on('save', color => {
            mfnPickr.hide();
        }).on('change', (color, source, instance) => {

            if( isBlocks() ) return;

            var cl = color.toHEXA().toString(0);
            if( color.a < 1 ) cl = color.toRGBA().toString(0).replaceAll(' ', '');

            $this_input.val( cl );

            //if( $edit_wrapper.length || $edit_field.hasClass('themeoption') ){
                if( $edit_field.hasClass('gradient') ){
                    gradientValue( $edit_field, true );
                }else if($edit_field.hasClass('fancy_divider color_top')){
                   changeFancyDividerColorTop($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), cl);
                }else if($edit_field.hasClass('fancy_divider color_bottom')){
                   changeFancyDividerColorBottom($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), cl);
                }else if($edit_field.hasClass('widget-chart color')){
                    changeColorChart($edit_wrapper.attr('data-element'), cl);
                }else if(typeof edited_item.type !== 'undefined' && edited_item.type == 'list_2'){
                  // prevent local styles change
                }else if(typeof css_path !== 'undefined' ){
                    changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, cl);
                }
            //}

            $(inputElement).closest('.color-picker-group').find('.form-addon-prepend .label').css('border-color', cl).css('background-color', cl);
            $(inputElement).closest('.color-picker-group').find('.form-addon-prepend .label').removeClass('light dark').addClass(getContrastYIQ( color.toHEXA().toString(0) ));

        }).on('changestop', (source, instance) => {

            var cl = instance._color.toHEXA().toString(0);

            if(typeof css_path == typeof undefined && $edit_field.hasClass('widget-chart color')){
                $this_input.val( cl ).trigger('change');
                return;
            }

            if( instance._color.a < 1 ) cl = instance._color.toRGBA().toString(0).replaceAll(' ', '');

            $this_input.val( cl ).trigger('change');

            if( $edit_wrapper.length ){
                if( $edit_field.hasClass('gradient') ){
                    gradientValue( $edit_field, false );
                }
            }

            if(typeof edited_item.type !== 'undefined' && edited_item.type == 'list_2'){
              // prevent local styles change
              return;
            }

            if(css_path && !$edit_field.hasClass('fancy_divider')){
                setTimeout(function() {
                    changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, 'remove');
                }, 50);
            }

        }).on('swatchselect', (source, instance) => {

            if(!css_path && $edit_field.hasClass('widget-chart color')){
                $this_input.val( instance._color.toHEXA().toString(0) ).trigger('change');
                return;
            }

            $this_input.val( instance._color.toHEXA().toString(0) ).trigger('change');

            if(typeof edited_item.type !== 'undefined' && edited_item.type == 'list_2'){
              // prevent local styles change
              return;
            }

            if(css_path && !$edit_field.hasClass('fancy_divider')){
                setTimeout(function() {
                    changeInlineStyles(css_path.replaceAll('|hover', '').replaceAll('|before', ':before').replaceAll('|after', ':after').replaceAll('|not', ':not'), css_style, 'remove');
                }, 50);
            }

        }).on('clear', instance => {
            mfnPickr.hide();
            $edit_field.find('.color-picker-clear').trigger('click');
        });
    }
})

// color picker

$editpanel.on('change', '.mfn-vb-formrow .color-picker-vb', function(e){
    e.preventDefault();
    var $field = $(this);
    var color = $field.val();

    if( color.length == 6 && !color.includes('#') ){
        $field.val('#'+color).trigger('change');
        return;
    }

    if( color == '#fff' ){
        $field.val('#ffffff').trigger('change');
        return;
    }

    if( color.length ){
        $field.closest('.color-picker-group').find('.form-addon-prepend .label').css('border-color', color).css('background-color', color);
        $field.closest('.color-picker-group').find('.form-addon-prepend .label').removeClass('light dark').addClass(getContrastYIQ( color ));
    }else{
        $field.closest('.color-picker-group').find('.form-addon-prepend .label').removeAttr('style').removeClass('dark').addClass('light');
    }

});

$editpanel.on('click', '.color-picker-clear', function(e){
    e.preventDefault();
    let $edit_wrapper = $(this).closest('.mfn-element-fields-wrapper');
    let $editfield = $(this).closest('.mfn-form-row');
    let $group = $(this).closest('.color-picker-group');

    if($editfield.hasClass('gradient')){
        $editfield.find('.color-picker-vb').val('').trigger('change');
    }else if($editfield.hasClass('box-shadow')){
        $group.find('.color-picker-vb').val('').trigger('change');
        $editfield.find('.field input').val('').trigger('change');
    }else{
        $group.find('.mfn-field-value').val('').trigger('change');
    }

    if( $editfield.find('.multiple-inputs .pseudo-field.mfn-field-value').length ){
        updatePseudoField( $editfield.find('.multiple-inputs') );
    }else if($editfield.hasClass('fancy_divider color_top')){
       changeFancyDividerColorTop($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), 'remove');
    }else if($editfield.hasClass('fancy_divider color_bottom')){
       changeFancyDividerColorBottom($edit_wrapper.attr('data-element'), $edit_wrapper.attr('data-group'), 'remove');
    }

    //changeInlineStyles(csspath, cssstyle, 'remove');
    $group.find('.form-addon-prepend .label').removeAttr('style').removeClass('dark').addClass('light');
});

$editpanel.on('click', '.color-picker-open', function(e){
    e.preventDefault();
    let $group = $(this).closest('.color-picker-group');
    $('.form-control .mfn-form-input', $group).trigger('click');
});


$editpanel.on('blur', '.custom_css .preview-custom_cssinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');

    $.each(styles, function( i, v ) {
      if(v.trim()){

        let st_expl = v.split(':');
        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it, st_expl[0], st_expl[1]);
        }
      }
    });

}).on('focus', '.custom_css .preview-custom_cssinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');

    $.each(styles, function( i, v ) {
      if(v.trim()){

        let st_expl = v.split(':');

        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it, st_expl[0], 'remove');
        }
      }
    });

});

/**
 *
 * DEPRECATED FIELDS
 *
 * */


// column inline css

$editpanel.on('blur', '.column.style .preview-styleinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');
    $.each(styles, function( i, v ) {
      if(v.trim()){
        let st_expl = v.split(':');
        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it+' .column_attr', st_expl[0], st_expl[1]);
        }
      }
    });
}).on('focus', '.column.style .preview-styleinput', function() {
    // inline styles column
    let it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    let val = $(this).val();

    let styles = val.split(';');
    $.each(styles, function( i, v ) {
      if(v.trim()){
        let st_expl = v.split(':');
        if(st_expl[0] && st_expl[1]){
            changeInlineStyles('.'+it+' .column_attr', st_expl[0], 'remove');
        }
      }
    });
});

/**
 *
 * END DEPRECATED FIELDS
 *
 * */

$editpanel.on('click', '.mfn-fr-help-icon', function(e) {
    e.preventDefault();
    if( $(this).closest('.mfn-form-row').find('.desc-group').is(':visible') ){
        $(this).closest('.mfn-form-row').find('.desc-group').slideUp(300);
    }else{
        $(this).closest('.mfn-form-row').find('.desc-group').slideDown(300);
    }
});

$editpanel.on('mouseover', '.panel-edit-item .tabs-wrapper:not(.mfn-initialized)', function() {
    tabsField.sortable();
});


function updatePseudoField($box){
    var value = '';
    var isEmpty = true;
    $box.find('.field input').each(function(i) {
        if( $(this).val().length ){
            isEmpty = false;
            return;
        }
    });
    if(!isEmpty){
        $box.find('.field input').each(function(i) {
            if( $(this).val().length ){
                value += i == 0 ? $(this).val() : ' '+$(this).val();
            }else if( !$(this).hasClass('boxshadow-inset') ){
                value += i == 0 ? '0' : ' '+'0';
            }
        });
    }
    $box.find('input.pseudo-field').val(value).trigger('change');
    historyStorage.add();
}



// global functions

// import element

function importFromClipboard(u, w){

    let import_clipboard = localStorage.getItem('mfn-builder') ? JSON.parse(localStorage.getItem('mfn-builder')) : {};

    if( import_clipboard.clipboard && !$content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-import').hasClass('pending') ){
        $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-import').addClass('pending');
        $.ajax({
            url: mfnajaxurl,
            data: {
                action: 'importfromclipboard',
                'mfn-builder-nonce': wpnonce,
                import: import_clipboard.clipboard,
                id: pageid,
                type: 'section'
            },
            type: 'POST',
            success: function(response){

                if( w == 'replace' ){
                    $content.find('.vb-item[data-uid="' +u+ '"]').after(response.html).remove();
                    //$navigator.find('.navigator-tree li.nav-'+u).after(response.navigator).remove();
                }else if( w == 'after' ){
                  $content.find('.vb-item[data-uid="' +u+ '"]').after(response.html);
                  //$navigator.find('.navigator-tree li.nav-'+u).after(response.navigator);
                }else{
                    $content.find('.vb-item[data-uid="' +u+ '"]').before(response.html);
                    //$navigator.find('.navigator-tree li.nav-'+u).before(response.navigator);
                }

                $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-import').removeClass('pending');

                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                loopAllStyleFields();
                inlineEditor();
                blink();


                runAjaxElements();

                runSorting();

            }
        });

    }
}

// export element

function elementToClipboard(u){

    if( !$content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').hasClass('pending') ){
        $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').addClass('pending');

        var formData = prepareForm( u );

        var btnText = $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').text();
        $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').html('<span class="mfn-icon mfn-icon-check-blue"></span> Exported');

        setTimeout(function(){
          $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').html('<span class="mfn-icon mfn-icon-export"></span> Export section');
          $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').removeClass('pending');
        }, 1000);

        $content.find('.section-header .mfn-disabled').removeClass('mfn-disabled');

        localStorage.setItem( 'mfn-builder', JSON.stringify({
          clipboard: formData
        }) );

        mfnbuilder.clipboard = formData;


        /*$.ajax({
            url: mfnajaxurl,
            data: {
                action: 'mfntoclipboard',
                'mfn-builder-nonce': wpnonce,
                sections: formData
            },
            type: 'POST',
            success: function(response){

                var btnText = $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').text();
                $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').html('<span class="mfn-icon mfn-icon-check-blue"></span> Exported');

                setTimeout(function(){
                  $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').html('<span class="mfn-icon mfn-icon-export"></span> Export section');
                  $content.find('.vb-item[data-uid="' +u+ '"] .mfn-section-export').removeClass('pending');
                }, 1000);

                $content.find('.section-header .mfn-disabled').removeClass('mfn-disabled');

                localStorage.setItem( 'mfn-builder', JSON.stringify({
                  clipboard: response
                }) );

                mfnbuilder.clipboard = response;

            }
        });*/

    }
}

// export/import - import submit

$('.mfn-import-button').on('click', function(e) {

    e.preventDefault();

    var single = 0; // import single section only

    if(!$('.mfn-import-button').hasClass('loading')){

        if($('#import-data-textarea.mfn-import-field').val().length){

            $('.mfn-import-button').addClass('loading disabled');

            var type = $('.panel-export-import-import .mfn-import-type').val();

            if( $('body').hasClass('mfn-template-section') || $('body').hasClass('mfn-template-wrap') ){
              single = 1;
              type = 'replace';
            }

            $.ajax({
                url: mfnajaxurl,
                data: {
                    action: 'importdata',
                    'mfn-builder-nonce': wpnonce,
                    import: $('#import-data-textarea.mfn-import-field').val(),
                    single: single,
                    count: 0,
                    id: pageid
                },

                type: 'POST',
                success: function(response){
                    $('.mfn-import-button').removeClass('loading disabled');

                    if( type == 'after' ){
                        $builder.append(response.html);
                        //$navigator.find('.navigator-tree').append(response.navigator);
                    }else if( type == 'before' ){
                        $builder.prepend(response.html);
                        //$navigator.find('.navigator-tree').prepend(response.navigator);
                    }else{
                        $builder.html(response.html);
                        //$navigator.find('.navigator-tree').html(response.navigator);
                    }

                    $.each(response.form, function(i, el) {

                      // Load Global Section/Wrap CSS
                      if( el.mfn_global_section_id || (el.attr && el.attr.global_wraps_select) ) {
                        const globalId = el.mfn_global_section_id ? el.mfn_global_section_id : el.attr.global_wraps_select;
                        $content.find('head').append(`<link rel="stylesheet" type="text/css" href='${mfn.site_url}/wp-content/uploads/betheme/css/post-${globalId}.css' />`);
                      }

                      mfnvbvars.pagedata.push(el);
                    });

                    if( $content.find('.vb-item .mfn-lottie-wrapper .lottie').length ){
                        $content.find('.vb-item .mfn-lottie-wrapper .lottie').each(function() {
                            $(this).attr('id', 'mfn_lottie_'+getUid());
                            $(this).closest('.vb-item').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
                            re_render();
                        });
                    }

                    loopAllStyleFields();

                    blink();

                    checkEmptyPage();

                    mfnChart();
                    inlineEditor();

                    runAjaxElements();

                    runSorting();

                }
            });

        }else{
            alert('Import input cannot be empty');
        }

    }else{
        alert('Loading. Please wait');
    }

});

// export/import - import single page

$('.mfn-import-single-page-button').on('click', function(e) {
    e.preventDefault();

    var import_place = $('.panel-export-import-single-page .mfn-import-type').val();

    if(!$('.mfn-import-single-page-button').hasClass('loading')){

        if($('#mfn-items-import-page').val().length){

            $('.mfn-import-single-page-button').addClass('loading disabled');

            $.ajax({
                url: mfnajaxurl,
                data: {
                    action: 'importsinglepage',
                    'mfn-builder-nonce': wpnonce,
                    import: $('#mfn-items-import-page').val(),
                    pageid: pageid,
                    count: 0
                },
                type: 'POST',
                success: function(response){
                    $('.mfn-import-single-page-button').removeClass('loading disabled');
                    removeStartBuilding();

                    if(import_place == 'before'){
                        $builder.prepend(response.html);
                        //$navigator.find('.navigator-tree').prepend(response.navigator);
                    }else if(import_place == 'after'){
                        $builder.append(response.html);
                        //$navigator.find('.navigator-tree').append(response.navigator);
                    }else{
                        $builder.html(response.html);
                        //$navigator.find('.navigator-tree').html(response.navigator);
                    }

                    $('#mfn-items-import-page').val('');

                    $.each(response.form, function(i, el) {
                        mfnvbvars.pagedata.push(el);
                    });

                    loopAllStyleFields();

                    inlineEditor();

                    runAjaxElements();
                    //historyStorage.add();

                    blink();

                    //location.reload();
                }
            });

        }else{
            alert('Import input cannot be empty');
        }

    }else{
        alert('Loading. Please wait');
    }

});


// export/import - builder seo / builder to seo

$('.mfn-builder-export-to-seo-button').on('click', function(e) {
    e.preventDefault();

    let $seo_button = $(this);

    if(!$seo_button.hasClass('loading')){
        $seo_button.addClass('loading disabled');

        var formData = prepareForm();

        $.ajax({
            url: mfnajaxurl,
            data: {
                action: 'mfnvb_builder_seo',
                'mfn-builder-nonce': wpnonce,
                sections: formData,
                pageid: pageid,
            },
            type: 'POST',
            success: function(response){

                $seo_button.removeClass('loading disabled');
                $seo_button.find('.btn-wrapper').text('Generated...');

                setTimeout(function(){
                    $seo_button.find('span.btn-wrapper').text('Generate');
              },2000);


                //location.reload();
            }
        });


    }else{
        alert('Loading. Please wait');
    }

});

$('.mfn-import-template-button').on('click', function(e) {
    e.preventDefault();

    if(!$('.mfn-import-template-button').hasClass('loading')){

        if($('.mfn-items-import-template li.active').length){

            $('.mfn-import-template-button').addClass('loading disabled');

            var type = $('.mfn-import-template-type').val();

            $.ajax({
                url: mfnajaxurl,
                data: {
                    action: 'importtemplate',
                    'mfn-builder-nonce': wpnonce,
                    import: $('.mfn-items-import-template li.active').data('id'),
                    count: 0,
                    id: $('.mfn-import-template-button').data('id')
                },
                type: 'POST',
                success: function(response){
                    $('.mfn-import-template-button').removeClass('loading disabled');
                    removeStartBuilding();
                    if( type == 'after' ){
                        $builder.append(response.html);
                        //$navigator.find('.navigator-tree').append(response.navigator);
                    }else if( type == 'before' ){
                        $builder.prepend(response.html);
                        //$navigator.find('.navigator-tree').prepend(response.navigator);
                    }else{
                        $builder.html(response.html);
                        //$navigator.find('.navigator-tree').html(response.navigator);
                    }

                    $.each(response.form, function(i, el) {
                        mfnvbvars.pagedata.push(el);
                    });

                    blink();

                    checkEmptySections();
                    checkEmptyWraps();
                    loopAllStyleFields();
                    inlineEditor();
                    runAjaxElements();

                }
            });

        }else{
            alert('Choose template first');
        }

    }else{
        alert('Loading. Please wait');
    }

});

// preview

$('.mfn-preview-generate').on('click', function(e) {
    e.preventDefault();

    var $el = $(this),
    tooltip = $el.data('tooltip'),
    previewURL = $el.attr('data-href');

    if(!$el.hasClass('pending')){

        //$el.attr('data-tooltip', 'Generating preview...');
        $el.addClass('pending');

        var formData = prepareForm();

        $.ajax({
            url: mfnajaxurl,
            data: {
                sections: formData,
                action: 'generatepreview',
                gtype: 'mfn-builder-preview',
                pageid: pageid,
                'mfn-builder-nonce': wpnonce,
            },
            type: 'POST',
            success: function(response){

                removeStartBuilding();

                if ( ! previewTab || previewTab.closed ) {
                    previewTab = window.open(response, 'preview' );
                    if ( previewTab ) {
                        previewTab.focus();
                    } else {
                        alert('Please allow popups to use preview');
                    }
                } else {
                    previewTab.location.reload();
                    previewTab.focus();
                }

                $el.removeClass('pending');

            }
        });

    }
});

// take post editing

$('.take-post-editing').on('click', function(e) {
    e.preventDefault();
    $el = $(this);

    if(!$el.hasClass('loading')){

        $el.addClass('loading disabled');

        $.ajax({
            url: mfnajaxurl,
            data: {
                action: 'takepostediting',
                'mfn-builder-nonce': wpnonce,
                pageid: $('.mfn-import-template-button').data('id')
            },
            type: 'POST',
            success: function(response){
                $('.mfn-modal-locker').remove();
            }
        });

    }
});

// prebuilts

$('.mfn-insert-prebuilt').on('click', function(e) {
    e.preventDefault();

    $el = $(this);

    if(!$el.hasClass('loading')){

        let id = $el.closest('li').data('id');
        let count = $content.find('.mcb-section').length;
        let isGlobalSectionEditor =  $content.find('body').hasClass('mfn-template-section');

        $el.addClass('loading disabled');

        // be global sections pbl == button on alert false

        if( isGlobalSectionEditor ){
          if( ! confirm('Using pre-built section will erase all current content in this section.\n\nAre you sure you want to do this?') ) {
            return $el.removeClass('loading').removeClass('empty').removeClass('disabled').text('+ '.btnText);
          }
        }

        $.ajax({
            url: mfnajaxurl,
            data: {
                'mfn-builder-nonce': wpnonce,
                action: 'insertprebuilt',
                id: id,
                pageid: pageid,
                count: count
            },
            type: 'POST',
            success: function(response){

                removeStartBuilding();

                $el.removeClass('loading').find('.text').text('Done');

                // be global sections pbl == remove content, no multiple sections
                if ( isGlobalSectionEditor ) {
                    $($content).find('.mcb-section').remove();
                    //$($navigator).find('.navigator-section').remove();
                }

                if( !$content.find('.mcb-section-'+prebuiltType).length || prebuiltType == 'end' ){
                    $builder.append(response.html);
                    //$navigator.find('.navigator-tree').append(response.navigator);
                }else{
                    $content.find('.mcb-section-'+prebuiltType).after(response.html);
                    //$navigator.find('.navigator-tree li.nav-'+$content.find('.mcb-section-'+prebuiltType).attr('data-uid')).after(response.navigator);
                }

                if( $content.find('.mfn-builder-content .mfn-builder-content .mcb-section').length ){
                    $content.find('.mfn-builder-content .mfn-builder-content .mcb-section').unwrap();
                }

                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                if(prebuiltType != 'end'){

                    let newPreBuiltType = $content.find('.mcb-section-'+prebuiltType).next('.mcb-section').attr('data-uid');

                    if($content.find('.mcb-section-'+prebuiltType).hasClass('empty')){
                        var pre_uid = $content.find('.mcb-section-'+prebuiltType).attr('data-uid');
                        //$navigator.find('.nav-'+pre_uid).remove();
                        $content.find('.mcb-section-'+prebuiltType).remove();
                        $('.mfn-form .mfn-vb-'+prebuiltType).remove();
                    }

                    prebuiltType = newPreBuiltType;

                }else{
                    prebuiltType = 'end';
                }


                setTimeout(function(){
                    $el.removeClass('disabled').find('.text').text('Insert');
                },1000);

                inlineEditor();
                loopAllStyleFields();

                blink();
                runSorting();


            }
        });


    }else{
        alert('Loading. Please wait');
    }

});

// set revision
function setRevision(type) {

    $list = $('.panel ul.revisions-list[data-type="'+type+'"]');

    let formData = prepareForm();

    $.ajax({
        url: mfnajaxurl,
        data: {
            'sections': formData,
            'action': 'setrevision',
            'revtype': type,
            'mfn-builder-nonce': wpnonce,
            'pageid': pageid
        },
        type: 'POST',
        success: function(response){

            if(type == 'autosave'){
                $('.btn-save-changes').removeClass('loading disabled');
            }

            if( response == 'empty' ){
                $('.mfn-save-revision').removeClass('loading disabled').find('.btn-wrapper').text('Nothing saved');
                setTimeout(function() { $('.mfn-save-revision .btn-wrapper').text('Save revision'); }, 2000);
            }else{
                displayRevisions(response, $list);
                if(type == 'revision'){
                    $('.mfn-save-revision').removeClass('loading disabled').find('.btn-wrapper').text('Saved');
                    setTimeout(function() { $('.mfn-save-revision .btn-wrapper').text('Save revision'); }, 2000);
                }else if(type == 'mfn-builder-preview'){
                    return true;
                }
            }
        },
        error: function(response){
            if(type == 'autosave'){
                $('.btn-save-changes').removeClass('loading disabled');
            }

            $('#mfn-preview-wrapper').append('<div style="display: none;" class="mfn-snackbar"><span class="mfn-icon mfn-icon-information"></span><div class="snackbar-message">An error occurred. Please refresh the BeBuilder</div></div>');
            $('.mfn-snackbar').fadeIn();
            closeSnackbar();

        }
    });
}

// autosave
if( !mfnvbvars.autosave ) setInterval(autosave, 300000);

function autosave(){
    if( mfnvbvars.view == 'demo' ) return;
    if(!$('.btn-save-changes').hasClass('disabled')){
        $('.btn-save-changes').addClass('loading disabled');
        setRevision('autosave');
    }
}

// manual save revision
$('.mfn-save-revision').on('click', function(e) {
    if( mfnvbvars.view == 'demo' ) return;
    if(!$('.mfn-save-revision').hasClass('disabled')){
        $('.mfn-save-revision').addClass('loading disabled');
        setRevision('revision');
    }
});

// restore
$('.revision-restore').on('click', function(e) {
    e.preventDefault();
    if( mfnvbvars.view == 'demo' ) return;
    restoreRev($(this));
});

function restoreRev($btn){
    if( mfnvbvars.view == 'demo' ) return;
    if(!$btn.hasClass('disabled')){

        $btn.addClass('loading disabled');

        $list = $('.panel ul[data-type="backup"]');

        $el = $btn.closest('li');

        var time = $el.attr('data-time'),
          type = $el.closest('ul').attr('data-type'),
          btnText = $el.text(),
          revision;

        $.ajax({
            url: mfnajaxurl,
            data: {
                action: 'restorerevision',
                'mfn-builder-nonce': wpnonce,
                time: time,
                type: type,
                pageid: pageid
            },
            type: 'POST',
            success: function(response){

                $builder.empty();

                mfnvbvars.pagedata = [];
                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                $builder.append(response.html);
                displayRevisions(response.revisions, $list);

                //$navigator.find('.navigator-tree').html(response.navigator);

                // render local styles

                $btn.removeClass('loading disabled');

                inlineEditor();
                blink();

                loopAllStyleFields();
                runSorting();
                runAjaxElements();
            }
        });

    }
}

function displayRevisions(rev, $list) {
    $list.empty();
    $.each(JSON.parse(rev), function(i, item) {
        $list.append('<li data-time="'+ i +'"><span class="revision-icon mfn-icon-clock"></span><div class="revision"><h6>'+ item +'</h6><a class="mfn-option-btn mfn-option-text mfn-option-blue mfn-btn-restore revision-restore" href="#"><span class="text">Restore</span></a></div></li>');
    });

    $('.revision-restore').on('click', function(e) {
        e.preventDefault();
        restoreRev($(this));
    });
}


// copy / paste element

var copypaste = {
    copy: function(el, action = false) {
        // localStorage.setItem('mfnvbcopy', el);
        mfncopy = el;

        if(action){
            //let $clipboard_copy = $content.find('.vb-item[data-uid="'+el+'"]');
            copypaste.paste(action);
            stickyWrap.init();
        }
    },
    paste: function($p) {

        if( !mfncopy ) return;

        var $el = $content.find('.vb-item[data-uid="'+mfncopy+'"]');
        var mfncopy_type = 'column';
        if( $el.hasClass('mcb-section') ){ mfncopy_type = 'section'; }else if( $el.hasClass('mcb-wrap') ){ mfncopy_type = 'wrap'; }

        if( $el.find('.mfn-initialized').length ){
            if( inlineEditors[$el.find('.mfn-initialized').attr('data-mfnindex')] ) inlineEditors[$el.find('.mfn-initialized').attr('data-mfnindex')].destroy();
            $el.find('.mfn-initialized').removeClass('mfn-initialized mfn-watchChanges mfn-blur-action mfn-focused').removeAttr('data-mfnindex');
        }

        $content.find('.vb-item[data-uid="'+mfncopy+'"]').removeClass('mfn-current-editing');

        $copy_el = $el.clone();

        if( $copy_el.hasClass('mcb-column') ){
            // column
            var newuid = copypaste.updateItem($copy_el);
        }else if( $copy_el.hasClass('mcb-wrap') ){
            // wrap
            var newuid = copypaste.updateWrap($copy_el);
        }else if( $copy_el.hasClass('mcb-section') ){
            // section
            var newuid = copypaste.updateSection($copy_el);
        }

        edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == newuid )[0];

        //$copy_nav = $navigator.find('.nav-'+newuid).clone();
        //$navigator.find('.nav-'+newuid).remove();

        if($p.hasClass('mcb-section') && mfncopy_type == 'wrap'){
            // wrap to section
            $p.find('.section_wrapper').append($copy_el);
            //$navigator.find('.nav-'+$p.attr('data-uid')+' ul').append($copy_nav);
        }else if($p.hasClass('mcb-section') && mfncopy_type == 'column'){
            // column to section
            if($p.find('.mcb-wrap-inner').length){
                $p.find('.mcb-wrap-inner').last().append($copy_el);
                //$navigator.find('.nav-'+$p.attr('data-uid')+' > ul > li:last-child ul').append($copy_nav);
            }else{
                alert('Append wrap first.');
            }
        }else if($p.hasClass('mcb-wrap') && mfncopy_type == 'column'){
            // column to wrap
            $p.find('.mcb-wrap-inner').append($copy_el);
            //$navigator.find('.nav-'+$p.attr('data-uid')+' ul').append($copy_nav);
        }else if( ( $p.hasClass('mcb-column') || $p.hasClass('mcb-wrap') ) && mfncopy_type == 'section'){
            // section to wrap or column
            $p.closest('.mcb-section').after($copy_el);
            //$navigator.find('.nav-'+$p.closest('.mcb-section').attr('data-uid')).after($copy_nav);
        }else if( $p.hasClass('mcb-column') && mfncopy_type == 'wrap'){
            // wrap to column
            $p.closest('.mcb-wrap').after($copy_el);
            //$navigator.find('.nav-'+$p.closest('.mcb-wrap').attr('data-uid')).after($copy_nav);
        }else if( $p.hasClass('mfn-builder-content')){
            $p.append($copy_el);
            //$navigator.find('.nav-'+$p.attr('data-uid')).after($copy_nav);
        }else{
            $p.after($copy_el);
            //$navigator.find('.nav-'+$p.attr('data-uid')).after($copy_nav);
        }

        if( builder_type == 'header' && mfncopy_type == 'wrap' ){
            checkWrapsCount( $content.find('.mcb-wrap-'+newuid).closest('.mcb-section').attr('data-uid') );
        }

        mfnChart();
        inlineEditor();
        checkEmptySections();
        checkEmptyWraps();

        if( $content.find('.vb-item[data-uid="'+newuid+'"] .mfn-lottie-wrapper .lottie').length ){
            $content.find('.vb-item[data-uid="'+newuid+'"] .mfn-lottie-wrapper .lottie').each(function() {
                $(this).attr('id', 'mfn_lottie_'+getUid());
                $(this).closest('.vb-item').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');
                re_render();
            });
        }

        setTimeout(function() {
            $content.find('.vb-item[data-uid="'+newuid+'"]').find('.mfn-header').first().find('.mfn-element-edit').trigger('click');

            if( $content.find('.vb-item[data-uid="'+newuid+'"]').closest('.mfn-looped-items').length ){
                re_render( $content.find('.vb-item[data-uid="'+newuid+'"]').closest('.mfn-looped-items').attr('data-uid') );
            }else{
                historyStorage.add();
            }

        }, 10);

    },
    updateItem: function($copy_el) {
        var old_uid = $copy_el.attr('data-uid');
        var new_uid = getUid();

        $copy_el.removeClass('mcb-item-'+old_uid).addClass('mcb-item-'+new_uid).attr('data-uid', new_uid);
        $copy_el.find('.mcb-column-inner').removeClass('mcb-column-inner-'+old_uid).addClass('mcb-column-inner-'+new_uid);

        if( $copy_el.find('.chart_box.mfn-initialized').length ){
            $copy_el.find('.chart_box.mfn-initialized').removeClass('mfn-initialized');
        }

        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_uid )[0];
        var copy_obj = {};

        copy_obj = JSON.parse( JSON.stringify(get_copy) );

        copy_obj.uid = new_uid;
        mfnvbvars.pagedata.push(copy_obj);

        //$copy_nav = $navigator.find('.navigator-tree li.nav-'+old_uid).clone();
        //$copy_nav.removeClass('nav-'+old_uid).addClass('nav-'+new_uid);
        //$copy_nav.children('a').attr('data-uid', new_uid);
        //$navigator.find('.navigator-tree li.nav-'+old_uid).after($copy_nav);

        loopAllStyleFields(new_uid);

        return new_uid;
    },
    updateWrap: function($copy_el) {
        var old_uid = $copy_el.attr('data-uid');
        var new_uid = getUid();

        // wrap
        $copy_el.removeClass('mcb-wrap-'+old_uid).addClass('mcb-wrap-'+new_uid).attr('data-uid', new_uid);
        $copy_el.find('.mcb-wrap-inner').removeClass('mcb-wrap-inner-'+old_uid).addClass('mcb-wrap-inner-'+new_uid);

        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_uid )[0];
        var copy_obj = {};

        copy_obj = JSON.parse( JSON.stringify(get_copy) );

        copy_obj.uid = new_uid;
        mfnvbvars.pagedata.push(copy_obj);

        //$copy_nav = $navigator.find('.navigator-tree li.nav-'+old_uid).clone();
        //$copy_nav.removeClass('nav-'+old_uid).addClass('nav-'+new_uid);
        //$copy_nav.children('a').attr('data-uid', new_uid);
        //$navigator.find('.navigator-tree li.nav-'+old_uid).after($copy_nav);

        // wraps childrens

        if( $copy_el.find('.vb-item.mcb-column').length ){
            $copy_el.find('.vb-item.mcb-column').each(function() {
                //copypaste.updateItem( $(this) );
                var $copy_el = $(this);
                var old_col_uid = $copy_el.attr('data-uid');
                var new_col_uid = getUid();

                $copy_el.removeClass('mcb-item-'+old_col_uid).addClass('mcb-item-'+new_col_uid).attr('data-uid', new_col_uid);
                $copy_el.find('.mcb-column-inner').removeClass('mcb-column-inner-'+old_col_uid).addClass('mcb-column-inner-'+new_col_uid);

                var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_col_uid )[0];
                var copy_obj = {};

                copy_obj = JSON.parse( JSON.stringify(get_copy) );
                copy_obj.uid = new_col_uid;
                mfnvbvars.pagedata.push(copy_obj);

                //$navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_col_uid+' > a').attr('data-uid', new_col_uid);
                //$navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_col_uid).removeClass('nav-'+old_col_uid).addClass('nav-'+new_col_uid);

                loopAllStyleFields(new_col_uid);
            });
        }

        loopAllStyleFields(new_uid);
        return new_uid;
    },
    updateSection: function($copy_el) {
        var old_uid = $copy_el.attr('data-uid');
        var new_uid = getUid();

        // section
        $copy_el.removeClass('mcb-section-'+old_uid).addClass('mcb-section-'+new_uid).attr('data-uid', new_uid);
        $copy_el.find('.mcb-section-inner').removeClass('mcb-section-inner-'+old_uid).addClass('mcb-section-inner-'+new_uid);

        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_uid )[0];
        var copy_obj = {};

        copy_obj = JSON.parse( JSON.stringify(get_copy) );

        copy_obj.ver = elements_ver;
        $copy_el.removeClass('mfn-default-section mfn-header-sticky-section mfn-header-mobile-section').addClass('mfn-'+elements_ver+'-section');

        copy_obj.uid = new_uid;
        mfnvbvars.pagedata.push(copy_obj);

        //$copy_nav = $navigator.find('.navigator-tree li.nav-'+old_uid).clone();
        //$copy_nav.removeClass('nav-'+old_uid).addClass('nav-'+new_uid);
        //$copy_nav.children('a').attr('data-uid', new_uid);
        //$navigator.find('.navigator-tree li.nav-'+old_uid).after($copy_nav);

        // wraps childrens

        if( $copy_el.find('.vb-item.mcb-wrap').length ){
            $copy_el.find('.vb-item.mcb-wrap').each(function() {
                //copypaste.updateWrap( $(this) ); // because of nav tmp
                var $copy_el = $(this);
                var old_wrap_uid = $copy_el.attr('data-uid');
                var new_wrap_uid = getUid();

                // wrap
                $copy_el.removeClass('mcb-wrap-'+old_wrap_uid).addClass('mcb-wrap-'+new_wrap_uid).attr('data-uid', new_wrap_uid);
                $copy_el.find('.mcb-wrap-inner').removeClass('mcb-wrap-inner-'+old_wrap_uid).addClass('mcb-wrap-inner-'+new_wrap_uid);

                var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_wrap_uid )[0];
                var copy_obj = {};

                copy_obj = JSON.parse( JSON.stringify(get_copy) );

                copy_obj.uid = new_wrap_uid;
                mfnvbvars.pagedata.push(copy_obj);

                //$navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_wrap_uid+' > a').attr('data-uid', new_wrap_uid);
                //$navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+old_wrap_uid).removeClass('nav-'+old_wrap_uid).addClass('nav-'+new_wrap_uid);
                loopAllStyleFields(new_wrap_uid);

                // wraps childrens

                if( $copy_el.find('.vb-item.mcb-column').length ){
                    $copy_el.find('.vb-item.mcb-column').each(function() {

                        var $copy_el = $(this);
                        var old_col_uid = $copy_el.attr('data-uid');
                        var new_col_uid = getUid();

                        $copy_el.removeClass('mcb-item-'+old_col_uid).addClass('mcb-item-'+new_col_uid).attr('data-uid', new_col_uid);
                        $copy_el.find('.mcb-column-inner').removeClass('mcb-column-inner-'+old_col_uid).addClass('mcb-column-inner-'+new_col_uid);

                        var get_copy = mfnvbvars.pagedata.filter( (item) => item.uid == old_col_uid )[0];
                        var copy_obj = {};

                        copy_obj = JSON.parse( JSON.stringify(get_copy) );

                        copy_obj.uid = new_col_uid;
                        mfnvbvars.pagedata.push(copy_obj);

                        //$navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+new_wrap_uid+' li.nav-'+old_col_uid+' > a').attr('data-uid', new_col_uid);
                        //$navigator.find('.navigator-tree li.nav-'+new_uid+' li.nav-'+new_wrap_uid+' li.nav-'+old_col_uid).removeClass('nav-'+old_col_uid).addClass('nav-'+new_col_uid);
                        loopAllStyleFields(new_col_uid);
                    });
                }

            });
        }

        if( $copy_el.find('.promo_bar_slider').length ){
            runAjaxElements();
        }

        loopAllStyleFields(new_uid);
        return new_uid;
    }
}

function prepareStyleId(el){

    el = el.replaceAll('.', '');
    el = el.replaceAll('tablet', '');
    el = el.replaceAll('mobile', '');
    el = el.replaceAll('desktop', '');
    el = el.replaceAll(',', '');
    el = el.replaceAll('#', '');
    el = el.replaceAll('|', '');
    el = el.replaceAll(' ', '');
    el = el.replaceAll('(', '');
    el = el.replaceAll(')', '');
    el = el.replaceAll('[', '');
    el = el.replaceAll(']', '');
    el = el.replaceAll('>', '');
    el = el.replaceAll('_', '');
    el = el.replaceAll('-', '');
    el = el.replaceAll('=', '');
    el = el.replaceAll(':', '');
    el = el.replaceAll('"', '');

    return el;
}

// is bebuilder blocks
function isBlocks(){
    let disabled_blocks = ['header', 'popup', 'megamenu', 'footer'];
    if( !disabled_blocks.includes(builder_type)  ) {
      return $content.find('body').hasClass('mfn-builder-blocks');
    }
    return false;
}

// add local style

function addLocalStyle(u, v, s, r, uid){

    if( isBlocks() ){
      return;
    }

    var el = u+s;

    if(typeof u === "undefined" || typeof s === "undefined") return;

    el = prepareStyleId(el);

    if( $content.find('style.'+el+r).length ){
        $content.find('style.'+el+r).remove();
    }

    //console.log('add local style');

    var selector_arr = u.split(",");
    var selector_string = '';

    $.each( selector_arr, function( i, value ) {
        if( i > 0 ){ selector_string += ', '; }
        selector_string += value.replaceAll('|', ':');
    });

    // while changing margin or padding, recalculate transformed elements
    if( s.includes('padding') || s.includes('margin') ) {
        Transforms.attachNewMargins();
    }

    if( v == '' ) {
        if( (s.includes('padding') || s.includes('margin') || s.includes('flex')) && $content.find(selector_string+' .slick-slider.slick-initialized').length ){
            //$content.find(selector_string+' .slick-slider.slick-initialized').slick('setPosition');
        }
        return;
    }

    selector_string = selector_string.replace('mcb-column-inner', 'mcb-column-inner-'+uid);
    selector_string = selector_string.replace('mcb-wrap-inner', 'mcb-wrap-inner-'+uid);
    selector_string = selector_string.replace('mcb-section-inner', 'mcb-section-inner-'+uid);
    selector_string = selector_string.replace('section_wrapper', 'mcb-section-inner-'+uid);

    //console.log(selector_string+' / '+s+' / '+v);

    s = s.replace('_v2', '');

    if( r == 'tablet' ){
        $content.find('body').prepend('<style class="mfn-local-style '+el+r+'">@media(max-width: 969px){html '+selector_string.replace('.mfn-header-tmpl', '.mfn-ui.mfn-header-tmpl')+' { '+(s.replace('_tablet', ''))+': '+v+' }}</style>');
    }else if( r == 'mobile' ){
        $content.find('body').append('<style class="mfn-local-style '+el+r+'">@media(max-width: 767px){html '+selector_string.replace('.mfn-header-tmpl', '.mfn-ui.mfn-header-tmpl')+' { '+(s.replace('_mobile', ''))+': '+v+' }}</style>');
    }else{
        $content.find('head').append('<style class="mfn-local-style '+el+r+'">html '+selector_string.replace('.mfn-header-tmpl', '.mfn-ui.mfn-header-tmpl')+' { '+s+': '+v+' }</style>');
    }

    if( (s.includes('padding') || s.includes('margin') || s.includes('flex')) && $content.find(selector_string+' .slick-slider.slick-initialized').length ){
        //$content.find(selector_string+' .slick-slider.slick-initialized').slick('setPosition');
    }
}

// change styles function

function changeInlineStyles(u, s, v){

    let styles = [];
    if($content.find(u).length){

        $content.find(u).each(function() {

            if(v == 'remove_style'){
                $(this).removeAttr('style');
            }else{
                let attrstyle = $(this).attr('style');

                if(typeof attrstyle !== typeof undefined && attrstyle !== false){
                    styles = attrstyle.split(';');
                }

                let sid = styles.findIndex( st => st.includes(s));

                if(styles[sid]){
                    if( v == 'remove' || !v.length ){
                        styles.splice(sid,1);
                    }else{
                        styles[sid] = s+': '+v;
                    }

                }else if(v.length && v != 'remove'){
                    styles.push(s+': '+v);
                }
                //styles[sid] ? styles[sid] = s+': '+v : styles.push(s+': '+v);

                let newstyles = styles.join(';');
                $(this).attr('style', newstyles);
            }

        });
    }
}

// change fancy divider color

function changeFancyDividerColorTop(u, g, v){

    let style = $('.mfn-element-fields-wrapper .style .preview-styleinput').val();

    if(style == 'circle up' || style == 'curve up' || style == 'triangle up'){
        changeInlineStyles('.'+u+' svg', 'background', v);
    }else{
        changeInlineStyles('.'+u+' svg path', 'fill', v);
        changeInlineStyles('.'+u+' svg path', 'stroke', v);
    }
}
function changeFancyDividerColorBottom(u, g, v){
    let style = $('.mfn-element-fields-wrapper .style .preview-styleinput').val();

    if(style == 'circle down' || style == 'curve down' || style == 'triangle down'){
        changeInlineStyles('.'+u+' svg', 'background', v);
    }else{
        changeInlineStyles('.'+u+' svg path', 'fill', v);
        changeInlineStyles('.'+u+' svg path', 'stroke', v);
    }
}

// video bg

function setVideoBg(u, t, v){
    if(v != ''){
        if($content.find('.'+u+' .section_video video').length){
            if($content.find('.'+u+' .section_video video source[type="video/'+t+'"]').length){
                $content.find('.'+u+' .section_video video source[type="video/'+t+'"]').attr('src', v);
            }else{
                $content.find('.'+u+' .section_video video').append('<source type="video/'+t+'" src="'+v+'">');
            }
        }else{
            $content.find('.'+u).append('<div class="section_video"><div class="mask"></div><video poster autoplay="true" loop="true" muted="muted"><source type="video/'+t+'" src="'+v+'"></video></div>').addClass('has-video');
        }
    }else{
        if($content.find('.'+u+' .section_video video source[type="video/'+t+'"]').length){
            $content.find('.'+u+' .section_video video source[type="video/'+t+'"]').remove();
        }
        if(!$content.find('.'+u+' .section_video video source').length){
            $content.find('.'+u+' .section_video').remove();
            $content.find('.'+u).removeClass('has-video');
        }
    }
}

// chart color

function changeColorChart(u, v){
    if(v != 'transparent'){
        $content.find('.'+u+' .chart').attr('data-bar-color', v);
    }else{
        $content.find('.'+u+' .chart').attr('data-bar-color', '#000');
    }
}

// image for widget

function imageForWidget(u, v, p){

    p ? p = p : '';

    // console.log('# imageForWidget');

    if( isBlocks() ){
      if( p != 'after' && p != 'hoverimg' ){

        // hide icon
        if( $content.find('.'+u).is('.column_counter, .column_icon_box, .column_icon_box_2, .column_list') ){
          if(v){
            $content.find('.'+u+' .item-preview-icon').addClass('empty');
          } else {
            $content.find('.'+u+' .item-preview-icon').removeClass('empty');
          }
        }

        // change image src
        $content.find('.'+u+' .item-preview-image').attr('src',v);

        // empty class
        if(v){
          $content.find('.'+u+' .item-preview-image').parent().removeClass('empty');
        } else {
          $content.find('.'+u+' .item-preview-image').parent().addClass('empty');
        }

      }
    } else if($content.find('.'+u).hasClass('column_article_box')){
        // article box
        $content.find('.'+u+' .article_box .photo_wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
    }else if($content.find('.'+u).hasClass('column_before_after')){
        // before after
        if(p == 'before'){
            $content.find('.'+u+' .twentytwenty-before').attr('src', v);
        }else if(p == 'after'){
            $content.find('.'+u+' .twentytwenty-after').attr('src', v);
        }
        $content.find('.before_after.twentytwenty-container').twentytwenty();
        resetBeforeAfter(u);
    }else if($content.find('.'+u).hasClass('column_counter')){
        // counter
        if( v != '' ){
            $content.find('.'+u+' .icon_wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
        }else if( $('.panel-edit-item .mfn-form-row .preview-iconinput').val() ){
            $content.find('.'+u+' .icon_wrapper').html('<i class="' +$('.panel-edit-item .mfn-form-row .preview-iconinput').val()+ '"></i>');
        }
    }else if($content.find('.'+u).hasClass('column_feature_box')){
        // feature box
        $content.find('.'+u+' .photo_wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
    }else if($content.find('.'+u).hasClass('column_flat_box') && p == 'boximg'){
        // flat box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_flat_box') && p == 'iconimg'){
        // flat box icon
        if(v != ''){
            $content.find('.'+u+' .icon').html('<img class="scale-with-grid" src="'+v+'"  alt="">');
        }else{
            $content.find('.'+u+' .icon').html('');
        }
    }else if($content.find('.'+u).hasClass('column_hover_box') && p == 'mainimg'){
        // hover box
        $content.find('.'+u+' img.visible_photo').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_hover_box') && p == 'hoverimg'){
        // hover box
        $content.find('.'+u+' img.hidden_photo').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_how_it_works')){
        // how it works
        if(v){
            $content.find('.'+u+' .how_it_works').removeClass('no-img');
            if($content.find('.'+u+' .how_it_works .image img').length){
                $content.find('.'+u+' .how_it_works .image img').attr('src', v).removeAttr('width').removeAttr('height');;
            }else{
                $content.find('.'+u+' .how_it_works .image').append('<img src="'+v+'" class="scale-with-grid" alt="">');
            }
        }else{
            $content.find('.'+u+' .how_it_works').addClass('no-img');
            $content.find('.'+u+' .how_it_works .image img').remove();
        }
    }else if($content.find('.'+u).hasClass('column_icon_box')){
        // icon box
        if(v != ''){
            if($content.find('.'+u+' .icon_box .image_wrapper img').length){
                $content.find('.'+u+' .icon_box .image_wrapper img').attr('src', v);
            }else{
                if($content.find('.'+u+' .icon_box .icon_wrapper').length) { $content.find('.'+u+' .icon_box .icon_wrapper').remove(); }
                $content.find('.'+u+' .icon_box').prepend('<div class="image_wrapper"><img src="'+v+'" class="scale-with-grid" alt=""></div>');
            }
        }else if( $('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-iconinput').val().length ){
            $content.find('.'+u+' .icon_box .image_wrapper').remove();
            $content.find('.'+u+' .icon_box').prepend('<div class="icon_wrapper"><div class="icon"><i class="'+$('.mfn-ui .panel-edit-item .mfn-form .mfn-form-control.preview-iconinput').val()+'"></i></div></div>');
        }else{
            if($content.find('.'+u+' .icon_box .icon_wrapper').length) { $content.find('.'+u+' .icon_box .icon_wrapper').remove(); }
            if($content.find('.'+u+' .icon_box .image_wrapper').length) { $content.find('.'+u+' .icon_box .image_wrapper').remove(); }
        }
    }else if($content.find('.'+u).hasClass('column_image')){
        // image
        $content.find('.'+u+' .image_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');
    }else if($content.find('.'+u).hasClass('column_list')){
        // list
        $content.find('.'+u+' .list_left').removeClass('list_icon list_image').addClass('list_image').html('<img src="'+v+'" class="scale-with-grid" alt="">');
    }else if($content.find('.'+u).hasClass('column_photo_box')){
        // photo box
        $content.find('.'+u+' .image_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_promo_box')){
        // promo box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_sliding_box')){
        // sliding box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_story_box')){
        // sliding box
        $content.find('.'+u+' .photo_wrapper img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_trailer_box')){
        // trailer box
        $content.find('.'+u+' .trailer_box img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_zoom_box') && p == 'main'){
        // zoom box main
        $content.find('.'+u+' .photo img').attr('src', v).removeAttr('width').removeAttr('height');;
    }else if($content.find('.'+u).hasClass('column_zoom_box') && p == 'desc'){
        // zoom box desc
        if(v){
            if($content.find('.'+u+' .desc_wrap .desc_img img').length){
                $content.find('.'+u+' .desc_wrap .desc_img img').attr('src', v);
            }else{
                $content.find('.'+u+' .desc_wrap').prepend('<div class="desc_img"><img class="scale-with-grid" src="'+v+'" alt=""></div>');
            }
        }else{
            if($content.find('.'+u+' .desc_wrap .desc_img img').length){
                $content.find('.'+u+' .desc_wrap .desc_img').remove();
            }
        }
    }else if($content.find('.'+u).hasClass('mcb-section') && p == 'decortop'){
        // section decor top
        if(v.length){
            if($content.find('.'+u+' .section-decoration.top').length){
                $content.find('.'+u+' .section-decoration.top').css({ 'background-image': 'url('+v+')'});
            }else{
                $content.find('.'+u).prepend('<div class="section-decoration top" style="background-image:url('+v+');"></div>');
            }
        }else{
            $content.find('.'+u+' .section-decoration.top').remove();
        }
    }else if($content.find('.'+u).hasClass('mcb-section') && p == 'decorbottom'){
        // section decor bottom
        if(v != ''){
            if($content.find('.'+u+' .section-decoration.bottom').length){
                $content.find('.'+u+' .section-decoration.bottom').css({ 'background-image': 'url('+v+')'});
            }else{
                $content.find('.'+u).append('<div class="section-decoration bottom" style="background-image:url('+v+');"></div>');
            }
        }else{
            $content.find('.'+u+' .section-decoration.bottom').remove();
        }
    }else if($content.find('.'+u).hasClass('column_our_team')){
        // our team
        $content.find('.'+u+' .image_wrapper img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_our_team_list')){
        // our team list
        $content.find('.'+u+' .image_wrapper img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_pricing_item')){
        // pricing item
        if( v ){
            if( $content.find('.'+u+' .image').length ){
                $content.find('.'+u+' .image img').attr('src', v);
            }else{
                $content.find('.'+u+' .plan-header').prepend('<div class="image"><img src="'+v+'" alt="" /></div>');
            }
        }else{
            $content.find('.'+u+' .image').remove();
        }

    }else if($content.find('.'+u).hasClass('column_header_icon')){
        // header icon
        $content.find('.'+u+' .icon-wrapper img').remove();
        $content.find('.'+u+' .icon-wrapper i').remove();
        $content.find('.'+u+' .icon-wrapper svg').remove();
        $content.find('.'+u+' .icon-wrapper').prepend('<img width="20" src="'+v+'" alt="">');
    }else if($content.find('.'+u).hasClass('column_chart')){
        // chart
        if(v){
            if($content.find('.'+u+' .chart .image img').length){
                $content.find('.'+u+' .chart .image img').attr('src', v);
            }else{
                $content.find('.'+u+' .chart .num').remove();
                $content.find('.'+u+' .chart .icon').remove();
                $content.find('.'+u+' .chart').prepend('<div class="image"><img class="scale-with-grid" src="'+v+'" alt="" /></div>');
            }
        }else if($('.panel-edit-item .mfn-form-row .preview-iconinput').val().length){
            $content.find('.'+u+' .chart .image').remove();
            $content.find('.'+u+' .chart .label').remove();
            $content.find('.'+u+' .chart').prepend('<div class="icon"><i class="'+$('.panel-edit-item .mfn-form .preview-iconinput').val()+'"></i></div>');
        }else if($('.panel-edit-item .mfn-form-row .preview-labelinput').val().length){
            $content.find('.'+u+' .chart .image').remove();
            $content.find('.'+u+' .chart .icon').remove();
            $content.find('.'+u+' .chart').prepend('<div class="num">'+$('.panel-edit-item .mfn-form-row .preview-labelinput').val()+'</div>');
        }else{
            $content.find('.'+u+' .chart .image').remove();
            $content.find('.'+u+' .chart .icon').remove();
            $content.find('.'+u+' .chart .num').remove();
        }

    }else if($content.find('.'+u).hasClass('column_header_logo')){
        // logo
        $content.find('.'+u+' img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_footer_logo')){
        // logo
        $content.find('.'+u+' img').attr('src', v);
    }else if($content.find('.'+u).hasClass('column_icon_box_2')){
        if( v ){
            if( $content.find('.'+u+' .icon-wrapper').length ){
                $content.find('.'+u+' .icon-wrapper').html('<img class="scale-with-grid" src="'+v+'" alt="">');
            }else{
                $content.find('.'+u+' .desc_wrapper').before('<div class="icon-wrapper"><img class="scale-with-grid" src="'+v+'" alt=""></div>');
            }
        }else{
            if( $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.icon .preview-iconinput').val().length ){
                if( $content.find('.'+u+' .icon-wrapper i').length ){
                    $content.find('.'+u+' .icon-wrapper i').attr('class', $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.icon .preview-iconinput').val());
                }else{
                    $content.find('.'+u+' .icon-wrapper').html('<i class="'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.icon .preview-iconinput').val()+'" aria-hidden="true"></i>');
                }
            }else if( $editpanel.find('.panel-edit-item .mfn-form .icon_box_2.label .mfn-field-value').val().length ){
                if( $content.find('.'+u+' .icon-wrapper').length ){
                    $content.find('.'+u+' .icon-wrapper').html('<span class="icon-label">'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.label .mfn-field-value').val()+'</span>');
                }else{
                    $content.find('.'+u+' .desc_wrapper').before('<div class="icon-wrapper"><span class="icon-label">'+$editpanel.find('.panel-edit-item .mfn-form .icon_box_2.label .mfn-field-value').val()+'</span></div>');
                }
            }else{
                $content.find('.'+u+' .icon-wrapper').remove();
            }
        }
    }else if($content.find('.'+u).hasClass('column_header_burger')){
        // menu burger
        $content.find('.'+u+' .icon-wrapper img').remove();
        $content.find('.'+u+' .icon-wrapper i').remove();
        $content.find('.'+u+' .icon-wrapper svg').remove();
        if( v ){
            $content.find('.'+u+' .icon-wrapper').prepend('<img src="'+v+'" alt="">');
        }else if( $editpanel.find('.panel-edit-item .mfn-form .header_burger.icon .preview-iconinput').val().length ){
            $content.find('.'+u+' .icon-wrapper').prepend('<i class="'+$editpanel.find('.panel-edit-item .mfn-form .header_burger.icon .preview-iconinput').val()+'"></i>');
        }else{
            $content.find('.'+u+' .icon-wrapper').prepend('<i class="icon-menu-fine"></i>');
        }
    }else if($content.find('.'+u).hasClass('column_popup_exit')){
        if(v != ''){
            if( $content.find('.'+u+' .button_icon').length ){
                $content.find('.'+u+' .button_icon').html('<img src="'+v+'" alt="">');
            }else{
                $content.find('.'+u+' .exit-mfn-popup').addClass('has-icon');
                $content.find('.'+u+' .exit-mfn-popup').prepend('<span class="button_icon"><img src="'+v+'" alt=""></span>');
            }
        }else{
            if( $('.mfn-form-row.popup_exit.icon .mfn-field-value').val().length ){
                $content.find('.'+u+' .button_icon').html('<i class="'+$('.mfn-form-row.popup_exit.icon .mfn-field-value').val()+'"></i>');
            }else{
                $content.find('.'+u+' .button_icon').remove();
                $content.find('.'+u+' .exit-mfn-popup').removeClass('has-icon');
            }
        }
    }
}

function resetBeforeAfter(u){
    if($content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container').length){
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container .twentytwenty-overlay').remove();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container .twentytwenty-after-label').remove();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container .twentytwenty-handle').remove();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container').unwrap();
        $content.find('.vb-item[data-uid='+u+'] .before_after.twentytwenty-container').twentytwenty();
    }
}

// MEDIA

var uploader = {
    sortable: function(galleryContainer = false) {

        if( !galleryContainer ){
            galleryContainer = $('.gallery-container:not(.mfn-initialized)');
        }

        galleryContainer.each(function() {

            var $modulebox = $(this).closest('.mfn-form-row');
            var $input = $modulebox.find('.upload-input.mfn-field-value');
            var groupid = $(this).closest('.mfn-element-fields-wrapper').attr('data-group');

            var $sortablebox = $(this);

            $sortablebox.sortable({
                stop: function(event, elem) {
                    var imgarr = [];
                    $sortablebox.find('li img').each(function() {
                        imgarr.push( $(this).attr('data-pic-id') );
                    });

                    $input.val(imgarr.join(',')).trigger('change');
                    re_render();
                }
            });
            $(this).addClass('mfn-initialized');
        });
    },
    browse: function() {
        $editpanel.on('click', '.panel .mfn-form .mfn-vb-formrow .browse-image .mfn-button-upload', function(e) {
            e.preventDefault();
            var frame,
                addImgLink = $(this),
                metaBox = addImgLink.closest('.browse-image'),
                $modulebox = metaBox.closest('.mfn-form-row'),
                $moduleWrapper = metaBox.closest('.mfn-element-fields-wrapper'),
                eluid = $moduleWrapper.attr('data-element'),
                groupid = $moduleWrapper.attr('data-group'),
                delImgAll = metaBox.find( '.mfn-button-delete-all'),
                imgContainer = metaBox.find( '.selected-image'),
                multipleImgs = false,
                multipleImgsInput = metaBox.find( '.upload-input' ),
                galleryContainer = metaBox.find( '.gallery-container' ),
                imgIdInput = metaBox.find( '.mfn-field-value, .field-to-object' );

            if(metaBox.hasClass('multi')){
                multipleImgs = 'add';
            }

            if ( frame ) { frame.open(); return; }

            frame = wp.media({
                multiple: multipleImgs,
            });


            if(multipleImgs && multipleImgs == 'add' && metaBox.find( '.upload-input' ).length){

                frame.on('open', function() {

                    var library = frame.state().get('selection'),
                    images = metaBox.find( '.upload-input' ).val();

                    if (!images) {
                        return true;
                    }

                    imageIDs = images.split(',');

                    imageIDs.forEach(function(id) {
                        var attachment = wp.media.attachment(id);
                        attachment.fetch();
                        library.add(attachment ? [attachment] : []);
                    });

                });

                frame.on( 'select', function() {

                    galleryContainer.html('');

                    var library = frame.state().get('selection'),
                    imageURLs = [],
                    imageIDs = [],
                    imageURL, outputHTML, joinedIDs;

                    library.map(function(image) {

                        image = image.toJSON();
                        imageURLs.push(image.url);
                        imageIDs.push(image.id);

                        if (typeof image.sizes !== 'undefined' && typeof image.sizes.medium !== 'undefined') {
                        imageURL = image.sizes.medium.url;
                        } else {
                        imageURL = image.url;
                        }

                        outputHTML = '<li class="selected-image">' +
                        '<img data-pic-id="' + image.id + '" src="' + imageURL + '" />' +
                        '<a class="mfn-option-btn mfn-button-delete" data-tooltip="Delete" href="#"><span class="mfn-icon mfn-icon-delete"></span></a>' +
                        '</li>';

                        galleryContainer.append(outputHTML);
                        uploader.sortable(galleryContainer);

                    });

                    joinedIDs = imageIDs.join(',').replace(/^,*/, '');
                    if (joinedIDs.length !== 0) {
                        metaBox.removeClass('empty');
                    }
                    multipleImgsInput.val(joinedIDs).trigger('change');
                    re_render();

                });
                frame.open();
            }else{

                frame.on( 'select', function() {

                    if( addImgLink.closest('.dynamic_items_wrapper').length ){

                        var attachment = frame.state().get('selection').first().toJSON();
                        dynamicItems.addNew(attachment.url, attachment.id);

                    }else{
                        metaBox.removeClass('empty');
                        var attachment = frame.state().get('selection').first().toJSON();
                        imgIdInput.val( attachment.url+'#'+attachment.id ).trigger('change');
                    }

                });

                frame.open();
            }
        });
    },

    itemsUpdate: function(attachment, imgIdInput) {

        var $modulebox = imgIdInput.closest('.mfn-form-row');
        var metaBox = $modulebox.find('.browse-image');
        var $moduleWrapper = imgIdInput.closest('.mfn-element-fields-wrapper');
        var imgContainer = metaBox.find( '.selected-image');
        var eluid = $moduleWrapper.attr('data-element');
        var uid = $content.find('.'+eluid).attr('data-uid');
        var rwd = 'desktop';

        if(imgContainer) {
            if( !attachment.includes('{') ){
                imgContainer.html( '<img src="'+attachment+'" alt="">' );
            }else{
                imgContainer.html( '' );
            }
            metaBox.removeClass('empty');
        }

        if($modulebox.hasClass('mfn_field_tablet')){
            rwd = 'tablet';
        }else if($modulebox.hasClass('mfn_field_mobile')){
            rwd = 'mobile';
        }

        if( $modulebox.hasClass('themeoption logo-img') ){
            // theme options

            if( $content.find('#Top_bar .logo img.logo-main').length ) {

                $content.find('#Top_bar .logo img.logo-main').attr('src', attachment);
                if( attachment.includes('.svg') ) {$content.find('#Top_bar .logo img.logo-main').addClass('svg');}else{$content.find('#Top_bar .logo img.logo-main').removeClass('svg');}
                if( !$('.themeoption.sticky-logo-img .mfn-field-value').val().length ) $content.find('#Top_bar .logo img.logo-sticky').attr('src', attachment);
            }else if( $content.find('#Header_creative .logo img.logo-main').length ) {
                $content.find('#Header_creative .logo img.logo-main').attr('src', attachment);
                if( attachment.includes('.svg') ) {$content.find('#Header_creative .logo img.logo-main').addClass('svg');}else{$content.find('#Header_creative .logo img.logo-main').removeClass('svg');}
                if( !$('.themeoption.sticky-logo-img .mfn-field-value').val().length ) $content.find('#Header_creative .logo img.logo-sticky').attr('src', attachment);
            }

        }else if( $modulebox.hasClass('themeoption retina-logo-img') ){

            if( $content.find('#Top_bar .logo img.logo-mobile').length ) {
                $content.find('#Top_bar .logo img.logo-mobile').attr('src', attachment);
            }else if($content.find('#Header_creative .logo img.logo-mobile').length) {
                $content.find('#Header_creative .logo img.logo-mobile').attr('src', attachment);
            }

        }else if( $modulebox.hasClass('themeoption sticky-logo-img') ){

            if( $content.find('#Top_bar .logo img.logo-sticky').length ) {
                $content.find('#Top_bar .logo img.logo-sticky').attr('src', attachment);
            }else if($content.find('#Header_creative .logo img.logo-sticky').length) {
                $content.find('#Header_creative .logo img.logo-sticky').attr('src', attachment);
            }

        }else if( $modulebox.hasClass('themeoption gdpr-content-image') ){

            if( $content.find('.mfn-gdpr-image img').length ) {
                $content.find('.mfn-gdpr-image img').attr('src', attachment);
            }

        }else{

            // all rest widgets

            if( attachment.includes('{') ) return;

            /*if( attachment.includes('{') && $modulebox.hasClass('inline-style-input') && $modulebox.hasClass('background-image') && ( ( builder_type == 'section' && $modulebox.hasClass('section') ) || ( builder_type == 'wrap' && $modulebox.hasClass('wrap') ) ) ) {
                attachment = sample_img;
                return;
            }*/

            if(imgIdInput.hasClass('preview-bg_imageinput')){
                changeInlineStyles(eluid, 'background-image', 'url('+attachment+')');
            }else if(imgIdInput.hasClass('preview-bg_video_mp4input')){
                setVideoBg(eluid, 'mp4', attachment);
            }else if(imgIdInput.hasClass('preview-bg_video_ogvinput')){
                setVideoBg(eluid, 'ogg', attachment);
            }else if($modulebox.hasClass('article_box') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if(imgIdInput.hasClass('preview-image_beforeinput')){
                imageForWidget(eluid, attachment, 'before');
            }else if(imgIdInput.hasClass('preview-image_afterinput')){
                imageForWidget(eluid, attachment, 'after');
            }else if($modulebox.hasClass('counter image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('feature_box') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('flat_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment, 'boximg');
            }else if($modulebox.hasClass('flat_box icon_image') && imgIdInput.hasClass('preview-icon_imageinput')){
                imageForWidget(eluid, attachment, 'iconimg');
            }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment, 'mainimg');
            }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-image_hoverinput')){
                imageForWidget(eluid, attachment, 'hoverimg');
            }else if($modulebox.hasClass('how_it_works image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('icon_box') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('image src') && imgIdInput.hasClass('preview-srcinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('list image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('photo_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('promo_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('sliding_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('story_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('trailer_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('zoom_box image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment, 'main');
            }else if($modulebox.hasClass('zoom_box content_image')){
                imageForWidget(eluid, attachment, 'desc');
            }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_topinput')){
                imageForWidget(eluid, attachment, 'decortop');
            }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_bottominput')){
                imageForWidget(eluid, attachment, 'decorbottom');
            }else if($moduleWrapper.attr('data-item') == 'video placeholder' && imgIdInput.hasClass('preview-placeholderinput')){
                re_render();
            }else if($moduleWrapper.attr('data-item') == 'video mp4' && imgIdInput.hasClass('preview-mp4input')){
                re_render();
            }else if($moduleWrapper.attr('data-item') == 'video ogv' && imgIdInput.hasClass('preview-ogvinput')){
                re_render();
            }else if($modulebox.hasClass('our_team image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('our_team_list image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('pricing_item image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('header_icon image')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('widget-chart image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('header_logo image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('footer_logo image') && imgIdInput.hasClass('preview-imageinput')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('popup_exit image')){
                imageForWidget(eluid, attachment);
            }else if($modulebox.hasClass('inline-style-input')){
                addLocalStyle($modulebox.attr('data-csspath'), 'url('+attachment+')', $modulebox.attr('data-name'), rwd, uid);
            }else if(!$modulebox.hasClass('image link_image')){
                imageForWidget(eluid, attachment);
            }
        }
    },

    delete: function() {
        $editpanel.on('click', '.mfn-form .mfn-vb-formrow .browse-image .mfn-button-delete', function(e) {
            e.preventDefault();

            var metaBox = $(this).closest('.browse-image'),
                $modulebox = metaBox.closest('.mfn-form-row'),
                $moduleWrapper = metaBox.closest('.mfn-element-fields-wrapper'),
                eluid = $moduleWrapper.attr('data-element'),
                uid = $content.find('.'+eluid).attr('data-uid'),
                groupid = $moduleWrapper.attr('data-group'),
                delImgAll = metaBox.find( '.mfn-button-delete-all'),
                imgContainer = metaBox.find( '.selected-image'),
                multipleImgs = false,
                multipleImgsInput = metaBox.find( '.upload-input' ),
                galleryContainer = metaBox.find( '.gallery-container' ),
                rwd = 'desktop',
                imgIdInput = metaBox.find( '.mfn-form-input' );

            if($modulebox.hasClass('mfn_field_tablet')){
                rwd = 'tablet';
            }else if($modulebox.hasClass('mfn_field_mobile')){
                rwd = 'mobile';
            }

            if(metaBox.hasClass('multi')){
                multipleImgs = 'add';
            }

            if(multipleImgs == 'add'){
                $(this).closest('.selected-image').remove();

                var imageIDs = [], id;

                metaBox.find('.gallery-container img').each(function() {
                    id = $(this).attr('data-pic-id');
                    imageIDs.push(id);
                });

                var joinedIDs = imageIDs.join( ',' );

                if (joinedIDs === '') {
                    metaBox.addClass('empty');
                }

                multipleImgsInput.val(joinedIDs).trigger('change');
                re_render();
            }else{

                imgContainer.html( '' );
                metaBox.addClass('empty');

                if( $modulebox.hasClass('themeoption gdpr-content-image') ){
                    imgIdInput.val( '#' ).trigger('change');
                }else{
                    imgIdInput.val( '' ).trigger('change');
                }

                if( $modulebox.hasClass('themeoption logo-img') ){

                    if( $content.find('#Top_bar .logo img.logo-main').length ) {
                        $content.find('#Top_bar .logo img.logo-main').attr('src', mfnvbvars.themepath+'/images/logo/logo.png').removeClass('svg');
                    }else{
                        $content.find('#Header_creative .logo img.logo-main').attr('src', mfnvbvars.themepath+'/images/logo/logo.png').removeClass('svg');
                    }

                }else if( $modulebox.hasClass('themeoption retina-logo-img') ){

                    if( $content.find('#Top_bar .logo img.logo-mobile').length ) {
                        $content.find('#Top_bar .logo img.logo-mobile').attr('src', mfnvbvars.themepath+'/images/logo/logo-retina.png');
                    }else if($content.find('#Header_creative .logo img.logo-mobile').length) {
                        $content.find('#Header_creative .logo img.logo-mobile').attr('src', mfnvbvars.themepath+'/images/logo/logo-retina.png');
                    }

                }else if( $modulebox.hasClass('themeoption sticky-logo-img') ){

                    if( $content.find('#Top_bar .logo img.logo-sticky').length ) {
                        $content.find('#Top_bar .logo img.logo-sticky').attr('src', mfnvbvars.themepath+'/images/logo/logo.png');
                    }else if($content.find('#Header_creative .logo img.logo-sticky').length) {
                        $content.find('#Header_creative .logo img.logo-sticky').attr('src', mfnvbvars.themepath+'/images/logo/logo.png');
                    }
                }else if( $modulebox.hasClass('themeoption gdpr-content-image') ){

                    if( $content.find('.mfn-gdpr-image img').length ) {
                        $content.find('.mfn-gdpr-image img').attr('src', mfnvbvars.themepath+'/images/cookies.png');
                    }

                }else{

                    if(imgIdInput.hasClass('preview-bg_imageinput')){
                        changeInlineStyles(eluid, 'background-image', '');
                    }else if(imgIdInput.hasClass('preview-bg_video_mp4input')){
                        setVideoBg(eluid, 'mp4', '');
                    }else if(imgIdInput.hasClass('preview-bg_video_ogvinput')){
                        setVideoBg(eluid, 'ogg', '');
                    }else if($modulebox.hasClass('article_box') && $modulebox.attr('data-name') == 'image' && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if(imgIdInput.hasClass('preview-image_beforeinput')){
                        imageForWidget(eluid, sample_img, 'before');
                    }else if(imgIdInput.hasClass('preview-image_afterinput')){
                        imageForWidget(eluid, sample_img, 'after');
                    }else if($modulebox.hasClass('counter image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('feature_box') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('flat_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img, 'boximg');
                    }else if($modulebox.hasClass('flat_box icon_image') && imgIdInput.hasClass('preview-icon_imageinput')){
                        imageForWidget(eluid, '', 'iconimg');
                    }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img, 'mainimg');
                    }else if($modulebox.hasClass('hover_box') && imgIdInput.hasClass('preview-image_hoverinput')){
                        imageForWidget(eluid, sample_img, 'hoverimg');
                    }else if($modulebox.hasClass('how_it_works image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('icon_box') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('image src') && imgIdInput.hasClass('preview-srcinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('list image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('photo_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('promo_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('sliding_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('story_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('trailer_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('zoom_box image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img, 'main');
                    }else if($modulebox.hasClass('zoom_box content_image')){
                        imageForWidget(eluid, '', 'desc');
                    }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_topinput')){
                        imageForWidget(eluid, '', 'decortop');
                    }else if($modulebox.hasClass('section') && imgIdInput.hasClass('preview-decor_bottominput')){
                        imageForWidget(eluid, '', 'decorbottom');
                    }else if($moduleWrapper.attr('data-item') == 'video placeholder' && imgIdInput.hasClass('preview-placeholderinput')){
                        re_render();
                    }else if($moduleWrapper.attr('data-item') == 'video mp4' && imgIdInput.hasClass('preview-mp4input')){
                        re_render();
                    }else if($moduleWrapper.attr('data-item') == 'video ogv' && imgIdInput.hasClass('preview-ogvinput')){
                        re_render();
                    }else if($modulebox.hasClass('our_team image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('our_team_list image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, sample_img);
                    }else if($modulebox.hasClass('popup_exit image')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('pricing_item image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('header_icon image')){
                        re_render();
                    }else if($modulebox.hasClass('widget-chart image') && imgIdInput.hasClass('preview-imageinput')){
                        imageForWidget(eluid, '');
                    }else if($modulebox.hasClass('header_logo image') && imgIdInput.hasClass('preview-imageinput')){
                        re_render();
                    }else if($modulebox.hasClass('footer_logo image') && imgIdInput.hasClass('preview-imageinput')){
                        re_render();
                    }else if($modulebox.hasClass('inline-style-input')){
                        addLocalStyle($modulebox.attr('data-csspath'), 'none', $modulebox.attr('data-name'), rwd, uid);
                    }else if(!$modulebox.hasClass('image link_image')){
                        imageForWidget(eluid, '');
                    }
                }
            }
        });
    },

    deleteAllGallery: function() {
        $editpanel.on('click', '.mfn-form .mfn-vb-formrow .browse-image .mfn-button-delete-all', function(e) {
            e.preventDefault();

            var metaBox = $(this).closest('.browse-image'),
                $moduleWrapper = metaBox.closest('.mfn-element-fields-wrapper'),
                eluid = $moduleWrapper.attr('data-element'),
                groupid = $moduleWrapper.attr('data-group'),
                multipleImgsInput = metaBox.find( '.upload-input' ),
                galleryContainer = metaBox.find( '.gallery-container' ),
                imgIdInput = metaBox.find( '.mfn-form-input' );

            galleryContainer.html('');
            metaBox.find( '.upload-input' ).val('').trigger('change');
            metaBox.addClass('empty');
            $content.find('.'+eluid+' .gallery').remove();
            $content.find('.'+eluid+' style').remove();
            imgIdInput.val( '' );
            re_render();

        });
    }
}



function runSorting(){

// iframe drag positioning fix

var iframe_offset = 0;
if($('body').hasClass('mfn-preview-mode') && screen !== 'desktop'){
    iframe_offset = 120 + ($(window).height()*0.05) + 50;
}else if($('body').hasClass('mfn-preview-mode')){
    iframe_offset = 120;
}

$.ui.ddmanager.frameOffsets={},$.ui.ddmanager.prepareOffsets=function(e,t){var o,n,f,i,a=$.ui.ddmanager.droppables[e.options.scope]||[],s=t?t.type:null,r=(e.currentItem||e.element).find(":data(ui-droppable)").addBack();e:for(o=0;o<a.length;o++)if(!(a[o].options.disabled||e&&!a[o].accept.call(a[o].element[0],e.currentItem||e.element))){for(n=0;n<r.length;n++)if(r[n]===a[o].element[0]){a[o].proportions().height=0;continue e}a[o].visible="none"!==a[o].element.css("display"),a[o].visible&&("mousedown"===s&&a[o]._activate.call(a[o],t),a[o].offset=a[o].element.offset(),proportions={width:a[o].element[0].offsetWidth,height:a[o].element[0].offsetHeight},"function"==typeof a[o].proportions?a[o].proportions(proportions):a[o].proportions=proportions,(f=iframe.window.document)!==document&&((i=$.ui.ddmanager.frameOffsets[f])||(i=$.ui.ddmanager.frameOffsets[f]=$((f.defaultView||f.parentWindow).frameElement).offset()),a[o].offset.left+=i.left,a[o].offset.top-=i.top-scroll_top-iframe_offset))}};

if($content){

$content.find('body').imagesLoaded(function() {

    // adding
    $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').draggable({
        helper: function(e) {
            return $('<div>').attr('data-type', $(e.target).closest('li').data('type')).addClass('mfn-vb-dragger mfn-vb-drag-item').text( $(e.target).closest('li').data('title') );
        },
        //helper: 'clone',
        cursorAt: {
            top: 20,
            left: 20
        },
        iframeFix: true,
        connectWith: ".mcb-wrap-inner",
        //revert: 'invalid',
        refreshPositions: false,
        cursor: 'move',
        start: function(event, elem) {
            dragging_new = 1;
            $builder.find('.mcb-column').addClass('ui-droppable-active-show');
        },
        stop: function(event, elem) {

            if(dragging_new == 1){

                if($content.find('.mfn-vb-drag-item').length){ $content.find('.mfn-vb-drag-item').remove(); }
                $builder.find('.mcb-column').removeClass('ui-droppable-active-show');

                if($content.find('.mfn-vb-sort-placeholder-widget').length) { $content.find('.mfn-vb-sort-placeholder-widget').remove(); }
                $content.find('body').removeClass('hover');

                setTimeout(resetIframeHeight, 100);
            }

            dragging_new = 0;
        },
        drag: function(event, elem){
            if(dragging_new == 1){
                elem.position.top -= $(window).scrollTop() - scroll_top;
            }
        }
    });


    $builder.find('.mfn-drag-helper').droppable({
        greedy: true,
        iframeFix: true,
        tolerance: 'touch',
        accept: "*",
        drop: function(event, ui) {
            if(dragging_new == 1){

                $content.find('.mfn-vb-dragover').removeClass('mfn-vb-dragover');

                $content.find('.mcb-column').removeClass('ui-droppable-active-show');

                if($(this).find('.mfn-vb-sort-placeholder-widget').length){ $(this).find('.mfn-vb-sort-placeholder-widget').remove(); }

                var dropped = ui.draggable;
                var dropped_item = dropped.attr('data-type');

                addNewWidget(dropped_item);

                if($content.find('.mfn-vb-drag-item').length){ $content.find('.mfn-vb-drag-item').remove(); }
                if($content.find('.mfn-vb-sort-placeholder-widget').length) { $content.find('.mfn-vb-sort-placeholder-widget').remove(); }

                dragging_new = 0;

                $content.find('body').removeClass('hover');

                setTimeout(resetIframeHeight, 100);

            }

        },
        over: function(event, elem) {
            if(dragging_new == 1){

                if( $(this).closest('.mfn-global-section').length || $(this).closest('.mfn-global-wrap').length ) {
                    return;
                }

                $content.find('.mfn-vb-dragover').removeClass('mfn-vb-dragover');
                $content.find('.mfn-vb-sort-placeholder-widget').remove();

                $(this).addClass("mfn-vb-dragover");

                new_widget_container = $(this).closest('.vb-item').attr('data-uid');

                if($(this).hasClass('mfn-dh-before')){
                    new_widget_position = 'before';
                    $(this).closest('.vb-item').before('<div class="mfn-vb-sort-placeholder-widget one column"></div>');
                }else{
                    new_widget_position = 'after';
                    if( $(this).parent().hasClass('mcb-column-inner') ){
                        $(this).closest('.vb-item').after('<div class="mfn-vb-sort-placeholder-widget one column"></div>');
                    }else if( $(this).parent().hasClass('empty') ){
                        $(this).parent().append('<div class="mfn-vb-sort-placeholder-widget one column"></div>');
                    }
                }

                new_widget_wrap = $(this).closest('.mcb-wrap').attr('data-order');
                new_widget_wrap_size = $(this).closest('.mcb-wrap').attr('data-desktop-size');
                new_widget_section = $(this).closest('.mcb-section').attr('data-order');
                new_widget_wcount = $(this).closest('.mcb-wrap').find('.mcb-column').length;

            }
        },
    });


    // widget
    $builder.find('.vb-item > .mcb-wrap-inner').sortable({
        connectWith: ".mcb-section:not(.mfn-global-section) .mcb-wrap:not(.mfn-global-wrap) .mcb-wrap-inner",
        placeholder: 'mfn-vb-sort-placeholder-widget',
        handle: ".mfn-column-drag",
        forcePlaceholderSize: false,
        iframeFix: true,
        iframeScroll: true,
        items: '.vb-item.mcb-column',
        appendTo: $content.find('body'),
        helper: function(e, ui) {
            return $('<div>').addClass('mfn-vb-dragger mfn-vb-drag-item').text( 'Item sort' );
        },
        cursorAt: {
            top: 20,
            left: 20
        },
        update: function(e, ui) {

            if( ui.item.closest('.mcb-wrap').find('.mcb-column').length ){
                ui.item.closest('.mcb-wrap').find('.mcb-column').each(function(i) {
                    $(this).attr('data-order', i);
                });
            }


            setTimeout(function() {
                if( $content.find('.mfn-force-rerender').length ){
                    re_render( $content.find('.mfn-force-rerender').attr('data-uid') );
                }
            }, 500);

            setTimeout(function() {

                var nav_parent = ui.item.closest('.mcb-wrap').attr('data-uid');
                var nav_item = ui.item.attr('data-uid');
                var nav_order = ui.item.attr('data-order');

                //var $nav_clone = $navigator.find('.navigator-tree li.nav-'+nav_item);
                //$navigator.find('.navigator-tree li.nav-'+nav_item).remove();

                /*if( $navigator.find('.navigator-tree li.nav-'+nav_parent+' ul').length ){
                    if( nav_order == 0 ){
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' ul').prepend( $nav_clone );
                    }else{
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' ul li:nth-child('+nav_order+')').after($nav_clone);
                    }
                }else{
                    $navigator.find('.navigator-tree li.nav-'+nav_parent).append( '<ul>'+$nav_clone+'</ul>' );
                }*/

                if( ui.item.closest('.mfn-looped-items').length ){
                    re_render( ui.item.closest('.mfn-looped-items').attr('data-uid') );
                }

                historyStorage.add();
            },100);

            checkEmptyWraps();

        },
        over: function(e, ui) {
            if(dragging_new == 1){
                ui.placeholder.addClass( 'one column' );
            }else{
                let size = ui.item.attr('data-desktop-size');
                let sizeClass = sizes.filter(s => s.key === size)[0];

                if(sizeClass) { ui.placeholder.addClass( sizeClass.desktop+' column' ); }
            }
        },
        start: function(event, elem) {
            scroll_top = $content.find("html, body").scrollTop();
            $content.find('.mcb-column').addClass('ui-droppable-active-show')

            if( $(elem.item).closest('.mfn-looped-items').length ) $(elem.item).closest('.mfn-looped-items').addClass('mfn-force-rerender');

        },
        stop: function(event, elem) {
            $content.find('.mcb-column').removeClass('ui-droppable-active-show')
        }
    });


    // wraps
    $builder.find('.vb-item > .section_wrapper, .vb-item > .section_wrapper > .mfn-queryloop-item-wrapper').sortable({
        connectWith: ".mcb-section:not(.mfn-global-section) .section_wrapper",
        placeholder: 'mfn-vb-sort-placeholder-wrap',
        handle: ".mfn-wrap-drag",
        //revert: true,
        forcePlaceholderSize: true,
        items: '.mcb-wrap.vb-item',
        appendTo: $content.find('body'),
        helper: function(e, ui) {
            return $('<div>').addClass('mfn-vb-dragger mfn-vb-drag-wrap').text( 'Wrap sort' );
        },
        opacity: 0.9,
        cursorAt: {
            top: 20,
            left: 20
        },
        update: function(e, ui) {

            if( ui.item.closest('.mcb-section').find('.mcb-wrap').length ){
                ui.item.closest('.mcb-section').find('.mcb-wrap').each(function(i) {
                    $(this).attr('data-order', i);
                });
            }

            setTimeout(function() {
                if( $content.find('.mfn-force-rerender').length ){
                    re_render( $content.find('.mfn-force-rerender').attr('data-uid') );
                }
            }, 500);

            setTimeout(function() {

               /* var nav_parent = ui.item.closest('.mcb-section').attr('data-uid');
                var nav_item = ui.item.attr('data-uid');
                var nav_order = ui.item.attr('data-order');

                var $nav_clone = $navigator.find('.navigator-tree li.nav-'+nav_item);
                $navigator.find('.navigator-tree li.nav-'+nav_item).remove();

                if( $navigator.find('.navigator-tree li.nav-'+nav_parent+' > ul').length ){
                    if( nav_order == 0 ){
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' > ul').prepend( $nav_clone );
                    }else{
                        $navigator.find('.navigator-tree li.nav-'+nav_parent+' > ul > li:nth-child('+nav_order+')').after($nav_clone);
                    }
                }else{
                    $navigator.find('.navigator-tree li.nav-'+nav_parent).append( '<ul>'+$nav_clone+'</ul>' );
                }*/

                if( ui.item.closest('.mfn-looped-items').length ){
                    re_render( ui.item.closest('.mfn-looped-items').attr('data-uid') );
                }

                historyStorage.add();

            },100);

            checkEmptySections();
        },
        start: function(event, elem) {
            stickyWrap.reset();
            scroll_top = $content.find("html, body").scrollTop();
            //$content.find('.mcb-wrap-inner').addClass('ui-droppable-active-show')
            // console.log(elem.item);
            if( $(elem.item).closest('.mfn-looped-items').length ) $(elem.item).closest('.mfn-looped-items').addClass('mfn-force-rerender');
        },
        stop: function(event, elem) {
            stickyWrap.init();
            //$content.find('.mcb-wrap-inner').removeClass('ui-droppable-active-show')
        }
    });

    // sections
    $builder.sortable({
        connectWith: ".mfn-builder-content",
        placeholder: 'mfn-vb-sort-placeholder-section',
        handle: ".mfn-section-drag",
        forcePlaceholderSize: true,
        //revert: true,
        iframeFix: true,
        iframeScroll: true,
        scrollSensitivity: 30,
        scroll: true,
        items: '.mcb-section.vb-item',
        containment: "parent",
        appendTo: $content.find('body'),
        helper: function(e, ui) {
            return $('<div>').addClass('mfn-vb-dragger mfn-vb-drag-section').text( 'Section sort' );
        },
        cursorAt: {
            top: 20,
            left: 20
        },
        update: function(e, ui) {

            $builder.find('.mcb-section').each(function(i) {
                $(this).attr('data-order', i);
            });

            setTimeout(function() {
                /*var nav_item = ui.item.attr('data-uid');
                var nav_order = ui.item.attr('data-order');

                var $nav_clone = $navigator.find('.navigator-tree li.nav-'+nav_item);
                $navigator.find('.navigator-tree li.nav-'+nav_item).remove();

                if( $navigator.find('.navigator-tree ul').length ){
                    if( nav_order == 0 ){
                        $navigator.find('.navigator-tree').prepend( $nav_clone );
                    }else{
                        $navigator.find('.navigator-tree > li:nth-child('+nav_order+')').after($nav_clone);
                    }
                }*/

                historyStorage.add();
            },100);

        },
        start: function(event, elem) {
            scroll_top = $content.find("html, body").scrollTop();
            $content.find('.mcb-section').addClass('ui-droppable-active-show')
        },
        stop: function(event, elem) {
            $content.find('.mcb-section').removeClass('ui-droppable-active-show')
        }
    });

});
}
}


function blink(his = false){
    setTimeout(function(){
        $builder.find('.blink').removeClass('blink');
        if( !his ) historyStorage.add();
    }, 500);
}
























function re_render( uid = false ){
    //if( mfnvbvars.view == 'demo' ) return;

    var type = edited_item.jsclass == 'wrap' || edited_item.jsclass == 'section' ? edited_item.jsclass : 'item';

    if( !uid ){
        uid = edited_item.uid;
    }else{
        var looped_obj = mfnvbvars.pagedata.filter( (item) => item.uid == uid )[0];
        type = looped_obj.jsclass == 'wrap' || looped_obj.jsclass == 'section' ? looped_obj.jsclass : 'item';
    }

    if( edited_item && edited_item.type == 'lottie' ){
        $content.find('.'+edited_item.uid+' .mcb-column-inner').css('min-height', $content.find('.'+edited_item.uid+' .mfn-lottie-wrapper').outerHeight());
        var it_lottie = $content.find('.mcb-item-'+edited_item.uid+' .lottie').attr('id');
        if( typeof iframe.window[it_lottie] !== 'undefined' && typeof iframe.window[it_lottie] === "function" ) iframe.window[it_lottie].destroy();
    }

    if( $content.find('.vb-item[data-uid="'+uid+'"]').hasClass('loading') ) return;

    $content.find('.vb-item[data-uid="'+uid+'"]').addClass('loading disabled');

    var formData = prepareForm2.get( uid );

    $.ajax({
        url: mfnajaxurl,
        data: {
            action: 'mfnrerendersection',
            'mfn-builder-nonce': wpnonce,
            sections: formData,
            id: pageid,
            type: type
        },
        type: 'POST',
        success: function(response){

            if(Array.isArray(response)){

                $content.find('.vb-item[data-uid="'+uid+'"]').replaceWith( response[0] );
                //$content.find('.'+it+' .mcb-column-inner').append( response[0] );
                var ajax_script = document.createElement("script");
                ajax_script.innerHTML = response[1];
                document.getElementById('mfn-vb-ifr').contentWindow.document.body.appendChild(ajax_script);

            }else{
                //$content.find('.'+it+' .mcb-column-inner').append(response);
                $content.find('.vb-item[data-uid="'+uid+'"]').replaceWith( response );
            }


            $('.mfn-element-fields-wrapper .mfn-form-row.mfn-field-loading').removeClass('mfn-field-loading');
            $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');
            checkEmptySections();
            checkEmptyWraps();

            historyStorage.add();
            runAjaxElements();



            inlineEditor();
        }
    });

}


var openEditForm = {

    do: function($edited_div, scroll = false) {

        if( wyswig_active ){

            if( $editpanel.find( '.mfn-form .html-editor' ).length ) MfnFieldTextarea.destroy();
            if( $editpanel.find( '.mfn-form .visual-editor' ).length ) tinymce.execCommand( 'mceRemoveEditor', false, 'mfn-editor' );

            wyswig_active = false;

            if( $content.find('.mcb-item-'+edited_item['uid']).length && $content.find('.mcb-item-'+edited_item['uid']).closest('.mfn-queryloop-item-wrapper').length ){
                re_render( $content.find('.'+edited_item['uid']).closest('.vb-item.mcb-section').attr('data-uid') );
            }else{
                re_render( $content.find('.'+edited_item['uid']).closest('.vb-item').attr('data-uid') );
            }
        }

        if( $content.find('.vb-item.mfn-current-editing').length ) $content.find('.vb-item.mfn-current-editing').removeClass('mfn-current-editing');
        $edited_div.addClass('mfn-current-editing');
        var id = $edited_div.attr('data-uid');

        //Global Wraps -> BeSections, PBL, Prevent opening edit form for sections
        if ( $('body').hasClass('mfn-template-wrap') && $edited_div.hasClass('section') ) {
            return;
        }

        //Global Wraps -> BeWraps, PBL, hide all elements except for global wraps
        if( $edited_div.hasClass('mfn-global-wrap') ) {
            $('.sidebar-panel').addClass('mfn-global-wrap-edit');
        } else {
            $('.sidebar-panel').removeClass('mfn-global-wrap-edit');
        }

        if( edited_item && typeof edited_item.jsclass !== 'undefined' ) $('.mfn-ui').removeClass('mfn-editing-'+edited_item.jsclass);
        $('.mfn-ui').removeClass('mfn-editing-element mfn-editing-section mfn-editing-wrap');

        $(".header:not(.header-edit-item):visible").hide();
        if( !$(".panel-edit-item").is(":visible") ) { $('.panel').hide(); $(".panel-edit-item").show(); $(".header-edit-item").show(); }

        edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == id )[0];

        if( !edited_item ) return;

        let element_type = 'item';

        if( edited_item.jsclass == 'section' ){
            element_type = 'section';
        }else if(edited_item.jsclass == 'wrap'){
            element_type = 'wrap';
        }

        // console.log(edited_item);
        // console.log(renderMfnFields[edited_item.jsclass]);

        const mfn_form = new MfnForm( renderMfnFields[edited_item.jsclass] );
        let form_html = mfn_form.render();

        $('.mfn-ui .panel-edit-item .mfn-form').html('<div class="mfn-element-fields-wrapper" data-item="'+edited_item.jsclass+'" data-element="mcb-'+element_type+'-'+edited_item.uid+'"><ul class="mfn-vb-formrow sidebar-panel-content-tabs"><li data-tab="content" class="spct-li-content active">Settings</li><li data-tab="style" class="spct-li-style">Style</li><li data-tab="advanced" class="spct-li-advanced">Advanced</li></ul>');

        // console.log(form_html);
        $('.mfn-ui .panel-edit-item .mfn-form .mfn-element-fields-wrapper').append(form_html);

        $('.mfn-ui .panel-edit-item .mfn-form').append('</div>');

        if( edited_item.jsclass != 'section' && edited_item.jsclass != 'wrap' && edited_item.jsclass != 'placeholder' ){
            const mfn_form_advanced = new MfnForm( renderMfnFields['advanced'] );
            let form_html_advanced = mfn_form_advanced.render();
            $('.mfn-ui .panel-edit-item .mfn-form .mfn-element-fields-wrapper').append( form_html_advanced );
        }

        if( edited_item.jsclass != 'wrap' && edited_item.jsclass != 'section' ){
            $('.mfn-ui').addClass('mfn-editing-element');
        }

        $('.mfn-ui').addClass('mfn-editing-'+edited_item.jsclass);

        if( (edited_item.jsclass == 'wrap' && $edited_div.closest('.section.mfn-looped-items').length) || (edited_item.jsclass == 'section' && $edited_div.find('.wrap.mfn-looped-items').length) ){
            if( $('.mfn-element-fields-wrapper .type.re_render li:not(:first-child) input').is('checked') ) $('.mfn-element-fields-wrapper .type.re_render li:first-child a').trigger('click');
            $('.mfn-element-fields-wrapper .type.re_render').addClass('mfn-disabled-field');
        }

        if( (edited_item.jsclass == 'wrap' || edited_item.jsclass == 'section') && typeof edited_item['attr']['type'] !== 'undefined' && edited_item['attr']['type'] == 'query' ){
            $('.mfn-element-fields-wrapper').addClass('mfn-is-query-looped');
            if( typeof edited_item['attr']['type'] !== 'undefined' && edited_item['attr']['query_display'] == 'slider' ){
                $('.mfn-element-fields-wrapper').addClass('mfn-is-ql-slider');
            }
        }

        if( typeof edited_item['attr'] !== 'undefined' ){
            // deprecated fields
            if( edited_item.jsclass == 'wrap' ){
                // empty now
            }else if( edited_item.jsclass == 'section' ){
                // empty now
            }else if( deprecated_fields.item.length ){
                deprecated_fields.item.map(function(id) {
                    if( typeof edited_item.attr[id] !== 'undefined' ) delete(edited_item.attr[id])
                });
            }

            // rewrited fields
            if( edited_item.jsclass == 'wrap' ){
                // empty now
            }else if( edited_item.jsclass == 'section' ){
                // empty now
            }else if( typeof rewrited_fields.item[edited_item.jsclass] !== 'undefined' ){
                rewrited_fields.item[edited_item.jsclass].map(function(it) {
                    if( typeof edited_item.attr[it.old] !== 'undefined' ) {
                        edited_item.attr[it.new] = edited_item.attr[it.old];
                        delete(edited_item.attr[it.old]);
                    }
                });
            }
        }

        //Global Wraps/Sections -> Hiding some elements on Visual Bar
        $('.mfn-visualbuilder .sidebar-panel').attr('data-edited', edited_item.title);

        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-edit-item .title-group .sidebar-panel-desc .sidebar-panel-title').html( edited_item.title );
        $('.mfn-visualbuilder .sidebar-panel .sidebar-panel-header .header-edit-item .title-group .sidebar-panel-icon').attr('class', 'sidebar-panel-icon mfn-icon-'+edited_item.icon);

        initWyswig();

        if( $('.mfn-slider-input').length ){
            $('.mfn-slider-input input.mfn-form-input').on('mouseenter', function() {
                $(this).inputDrag();
            });
        }

        onOpenEditForm();

        mfnoptsinputs.start();

        if( scroll && builder_type !== 'header' ){
            $content.find('html, body').animate({ scrollTop: $edited_div.offset().top - 50 }, 1000);
        }

        $(document).trigger('be:edit');

        //if($('body').hasClass('mfn-navigator-active') && !$('.mfn-navigator ul.navigator-tree li.nav-'+edited_item.uid+' > a.active-element').length ) be_navigator.show(edited_item.uid, true);

        return;

    }
}

function initWyswig(){
    if( $editpanel.find( '.mfn-form .mfn-element-fields-wrapper .html-editor' ).length ){
        wyswig_active = true;
        preventEdit = true;
        MfnFieldTextarea.create();
        //$(document).trigger('mfn:vb:edit');
    }

    if( $editpanel.find( '.mfn-form .mfn-element-fields-wrapper .visual-editor' ).length ){
        wyswig_active = true;
        preventEdit = true;
        MfnFieldVisual.init();
    }
}


/**
 * Builder settings
 */

var settings = {

    option: false,
    forceReload: false,

    start: function(){

        // column text editor

        if( $('#mfn-visualbuilder').hasClass('column-visual') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="column-visual"] li:first').removeClass('active')
            .siblings().addClass('active');
        }

        // navigation

        if( !$content.find("body").hasClass('mfn-modern-nav') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="mfn-modern-nav"] li:first').removeClass('active')
            .siblings().addClass('active');
        }

        // builder blocks

        if( $content.find("body").hasClass('mfn-builder-blocks') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="builder-blocks"] li:first').addClass('active')
            .siblings().removeClass('active');
        }

        if( $content.find("body").hasClass('simple-view') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="simple-view"] li:first').removeClass('active')
            .siblings().addClass('active');
        }

        if( $content.find("body").hasClass('hover-effects-disable') ){
          $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="hover-effects"] li:first').addClass('active')
            .siblings().removeClass('active');
        }

        // ui mode

        if( $('#mfn-visualbuilder').hasClass('mfn-ui-dark') && !$('#mfn-visualbuilder').hasClass('mfn-ui-auto') ){
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li').removeClass('active');
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li:last-child').addClass('active');
        }else if( $('#mfn-visualbuilder').hasClass('mfn-ui-light') ){
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li').removeClass('active');
            $('.mfn-ui .panel-settings .mfn-form .settings .form-control[data-option="ui-theme"] li:nth-child(2)').addClass('active');
        }else{
            settings.detectOsTheme();
        }

        settings.run();
    },
    run: function() {
        $('.mfn-ui .panel-settings .single-segmented-option.segmented-options ul li a').on('click', function(e) {
            e.preventDefault();

            if( mfnvbvars.view == 'demo' ) return;

            settings.forceReload = false;
            settings.option = $(this);

            var $li = settings.option.closest('li'),
            $row = settings.option.closest('.mfn-row');

            if( $row.hasClass('mfn-reload-required') ){
                $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm mfn-modal-600 show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-settings"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Confirmation box</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <img class="icon" alt="" src="'+mfnvbvars.themepath+'/muffin-options/svg/warning.svg"> <h3>Page reload is required</h3> <p>Continue?</p><a class="mfn-btn mfn-btn-red btn-wide btn-modal-close" href="#"><span class="btn-wrapper">Cancel</span></a> <a class="mfn-btn btn-wide btn-modal-confirm" href="#"><span class="btn-wrapper">Reload</span></a> <a class="mfn-btn mfn-btn-green btn-wide btn-modal-confirm-with-save" href="#"><span class="btn-wrapper">Save & Reload</span></a> </div></div></div>');

                $('.btn-modal-close').on('click', function(e) {
                    e.preventDefault();
                    $('.mfn-ui').removeClass('mfn-modal-open');
                    $('.modal-confirm.show').remove();
                    return;
                });

                $('.btn-modal-confirm').on('click', function(e) {
                    e.preventDefault();

                    if( $(this).hasClass('loading') ) return;
                    window.onbeforeunload = null;

                    $(this).addClass('loading disabled');
                    settings.forceReload = true;
                    settings.continue();
                });

                $('.btn-modal-confirm-with-save').on('click', function(e) {
                    e.preventDefault();

                    if( $(this).hasClass('loading') ) return;
                    window.onbeforeunload = null;

                    $(this).addClass('loading disabled');
                    settings.forceReload = true;

                    if(!$('.btn-save-form-primary.btn-save-changes').hasClass('disabled')){
                        $('.btn-save-form-primary.btn-save-changes').trigger('click');
                    }

                });

            }else{
                settings.continue();
            }

        });
    },

    continue: function() {

        //console.log('continue');

        var $li = settings.option.closest('li'),
            $row = settings.option.closest('.mfn-row');

        var option = settings.option.closest('.form-control').data('option'),
              value = false;

            $li.addClass('active')
              .siblings('li').removeClass('active');

            value = $li.data('value');

            if( option == 'mfn-modern-nav' || option == 'simple-view' ){

                if( value == 1 && !$content.find("body").hasClass(option) ){
                    $content.find("body").addClass(option);
                }else{
                    $content.find("body").removeClass(option);
                }

            }else if( option == 'hover-effects' ){

                if( value == 1 && !$content.find("body").hasClass('hover-effects-disable') ){
                    $content.find("body").addClass('hover-effects-disable');
                }else{
                    $content.find("body").removeClass('hover-effects-disable');
                }

            }else if( option == 'ui-theme' ){

                $("#mfn-visualbuilder").removeClass('mfn-ui-auto mfn-ui-dark mfn-ui-light').addClass(value);

                if( ! isBlocks() ){
                  $content.find('body').removeClass('mfn-ui-auto mfn-ui-dark mfn-ui-light').addClass(value);

                  if(value == 'mfn-ui-auto'){
                      settings.detectOsTheme();
                  }
                }

            }else{
                if( value ){
                  $('#mfn-visualbuilder').addClass(option);
                } else {
                  $('#mfn-visualbuilder').removeClass(option);
                }
            }

            $.ajax( mfnajaxurl, {
              type : "POST",
              data : {
                'mfn-builder-nonce': wpnonce,
                action: 'mfn_builder_settings',
                option: option,
                value: value,
              }

            }).done(function(response){

              // show info for pre-completed option

              if( ['pre-completed','column-visual'].includes(option) ){
                $row.addClass('changed');
              }

              if( 'hover-effects' == option ){
                triggerResize();
              }

              if( settings.forceReload ){
                location.reload();
                settings.forceReload = false;
              }

            });
    },

    detectOsTheme: function() {
        if( $('#mfn-visualbuilder').hasClass('mfn-ui-auto') && !$('#mfn-visualbuilder').hasClass('builder-blocks') ){
            if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                $('#mfn-visualbuilder').addClass('mfn-ui-dark');
                if($content) $content.find('body').addClass('mfn-ui-dark');
            }
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
                const newColorScheme = event.matches;

                if( newColorScheme ) {
                    $('#mfn-visualbuilder').addClass('mfn-ui-dark');
                    if($content) $content.find('body').addClass('mfn-ui-dark');
                }else{
                    $('#mfn-visualbuilder').removeClass('mfn-ui-dark');
                    if($content) $content.find('body').removeClass('mfn-ui-dark');
                }
                //const newColorScheme = event.matches ? $('#mfn-visualbuilder').addClass('mfn-ui-dark') /*$content.find('body').addClass('mfn-ui-dark')*/ : $('#mfn-visualbuilder').removeClass('mfn-ui-dark')/* $content.find('body').addClass('mfn-ui-dark')*/;

            });
        }
    }
}


var modernmenu = {
    start: function() {
        $builder.on('click', '.mfn-header .mfn-element-menu', function(e) {
            e.preventDefault();
            $(this).closest('.mfn-header').toggleClass('mfn-element-menu-opened');
        });
    }
}

/**
 * Introduction slider
 */

var introduction = {

  overlay: $('.mfn-intro-overlay'),

  options: {

    // introduction.options.get()

    get: function(){

      return $('#mfn-visualbuilder').hasClass('intro');

    },

    // introduction.options.set()

    set: function( value ){

        if( mfnvbvars.view == 'demo' ) return;

      $.ajax( mfnajaxurl, {

        type : "POST",
        data : {
          'mfn-builder-nonce': wpnonce,
          action: 'mfn_builder_settings',
          option: 'intro',
          value: value, // 0 - hide intro, 1 - show intro
        }

      });

    }

  },

  // introduction.open()

  open: function(){
    // do not open, when disabled support
    if ( parseInt( $('#mfn-visualbuilder').attr('data-tutorial') ) ) {
      return false;
    }

    var $slider = $('.mfn-intro-container ul');

    var slidesAmount = $('.mfn-intro-container ul li').size() - 1;

    // slider do not exists, ie. white label mode
    if( ! $slider.length ){
      return false;
    }

    // slider has been skipped before
    if( ! introduction.options.get() ){
      return false;
    }

    // FIX: wpbakery - dp not show introduction when page options closed
    if( $('#mfn-meta-page').hasClass('closed') ){
      return false;
    }

    $('body').addClass('mfn-modal-open');

    introduction.overlay.show();

    // slick has been initialized before so skip steps below
    if( $slider.hasClass('slick-slider') ){
      return false;
    }

    $slider.slick({
      cssEase: 'ease-out',
      dots: false,
      fade: true,
      infinite: false
    });

    $slider.on('afterChange', function(event, slick, currentSlide, nextSlide){
      if ( currentSlide === slidesAmount ){
        introduction.options.set(0);
      }
    });

    // close once on overlay click

    introduction.overlay.on('click', function(e){
      e.preventDefault();
      if ( $(e.target).hasClass('mfn-intro-overlay') ){
        introduction.close();
      }
    });

    // close permanently on X or 'skip' click

    $('.mfn-intro-close').on('click', function(e){
      e.preventDefault();
      introduction.options.set(0);
      introduction.close();
    });

  },

  // introduction.reopen()

  reopen: function(){
    introduction.options.set(1);
    $('#mfn-visualbuilder').addClass('intro');
    introduction.open();
  },

  // introduction.close()

  close: function(){
    $('body').removeClass('mfn-modal-open');
    $('#mfn-visualbuilder').removeClass('intro');
    introduction.overlay.fadeOut(200);
  }

};

introduction.open();

$('.introduction-reopen').on('click', function(e) {
  introduction.reopen();
});

// Global Wraps //

const GlobalWraps = {
    selectedWrapTemplate: '',
    selectedUid: '',
    uidsToRemove: [],
    regex: /(mcb-wrap-).([a-zA-Z0-9]*)/g, // to catch class name of wrap
    wrapTriggered: '',
    loadedPostsId: [], // prevent loading CSS files twice, just perf

    getGlobalWrap: function () {
        // Replace actual wrap with global wrap | => void
        const that = this;
        that.wrapTriggered.addClass('mfn-global-wrap').attr('data-wrap', that.selectedUid);

        $.ajax({
            url: mfnajaxurl,
            data: {
                action: 'importtemplate_wraponly',
                'mfn-builder-nonce': wpnonce,
                isGlobalWrap: true,
                id: that.selectedWrapTemplate,
                count: $(that.wrapTriggered).attr('data-order')
            },
            type: 'POST',
            success: function(response){
                if ( response === '0' ) return that.resetWrapToDefaults();

                // Imported content, insert it
                that.wrapTriggered.replaceWith(response.html);

                // Info for bebuilder, to know what is being saved
                $.each(response.form, function(i, el) {
                    el.title = 'Global Wrap';

                    if( el.type !== 'wrap' && el.type !== 'section') {
                        mfnvbvars.pagedata.push( el );
                    }
                });

                // CSS related stuff
                that.injectStylesheet();

                // New wrapTriggered
                let newClass = response.html.match(that.regex)[0];
                that.wrapTriggered = $content.find(`.${newClass}`);
                const newUid = that.wrapTriggered.attr('data-uid');

                // Change navigator info
                /*const navigatorWrap = $navigator.find('.navigator-tree').find(`[data-uid=${that.selectedUid}]`);
                navigatorWrap.closest('li').removeClass().addClass(`navigator-wrap nav-${newUid} toggle-disabled`);
                navigatorWrap[0].firstChild.nodeValue = 'Global Wrap';
                navigatorWrap[0].setAttribute('data-uid', newUid);
                const navigatorLink = $(navigatorWrap).first();
                navigatorLink.find('.navigator-size-label').text( that.wrapTriggered.attr( 'data-desktop-size' ) );*/

                // Remaining Lukas stuff
                blink();
                mfnChart();
                historyStorage.add();
                runAjaxElements();

                // Open edit form again, reload HTML.
                queueMicrotask(() => {
                   openEditForm.do( that.wrapTriggered );
                });

            },
        });
    },

    injectStylesheet: function ( ) {
        // While loading the stylesheet again, prevent loading CSS once more | => void
        if( !this.loadedPostsId.includes( this.selectedWrapTemplate ) ) {
            this.loadedPostsId.push( this.selectedWrapTemplate );
            $content.find('head').append(`<link rel="stylesheet" type="text/css" href='${mfn.site_url}/wp-content/uploads/betheme/css/post-${this.selectedWrapTemplate}.css' />`);
        }
    },

    fillWrapInfo: function( wrapClass, target ) {
        // Fill wrap info to be able to edit it | => void
        this.selectedUid = wrapClass.substring(9, wrapClass.length);
        this.selectedWrapTemplate = $(target).val();
        this.wrapTriggered = $content.find(`.wrap[data-uid=${this.selectedUid}]`);
    },

    resetWrapToDefaults: function() {
        // Create new wrap, replace the global wrap | => void
        const newWrap = elements.wrap(this.wrapTriggered.attr(`data-${screen}-size`));
        this.wrapTriggered.replaceWith(newWrap.html);
        this.wrapTriggered = $content.find(`.wrap[data-uid=${newWrap.uid}]`);

        // Replace navigator ID to new
        /*const navigatorWrap = $navigator.find('.navigator-tree').find(`[data-uid=${this.selectedUid}]`).attr('data-uid', newWrap.uid);
        navigatorWrap[0].firstChild.nodeValue = 'Wrap';
        navigatorWrap[0].setAttribute('data-uid', newWrap.uid);
        navigatorWrap.closest('li').removeClass().addClass(`navigator-wrap nav-${newWrap.uid}`);*/

        blink();
        historyStorage.add();

        queueMicrotask(() => openEditForm.do( this.wrapTriggered ));
    },
}

$editpanel.on('change', '.global_wraps_select', function(e) {
    const wrapClass = $(this).closest('.mfn-element-fields-wrapper').attr('data-element'); // mcb-wrap-uid
    const uidSelected = wrapClass.substring(9, wrapClass.length); //cut mcb-wrap, get the uid only
    const templateSelected = $(e.target); //dropdown, select template

    $edited_div = $content.find(`.wrap[data-uid=${uidSelected}]`);

    GlobalWraps.fillWrapInfo(wrapClass, templateSelected);

    if( !templateSelected.val() ) {
        return GlobalWraps.resetWrapToDefaults();
    }

    GlobalWraps.getGlobalWrap();
})

// Global Sections  //
const GlobalSections = {
    selectedSectionTemplate: '',
    selectedUid: '',
    uidsToRemove: [],
    regex: /(mcb-section-).([a-zA-Z0-9]*)/g, // to catch class name of wrap
    sectionTriggered: '',
    loadedPostsId: [], // prevent loading CSS files twice, just perf

    convertToGlobal: function(uid) {

        $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-preset"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Convert to Global Section</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"><div class="mfn-form-row"><input placeholder="Name it" type="text" class="mfn-form-control mfn-global-section-name"></div><a class="mfn-btn mfn-btn-blue btn-modal-confirm" '+( mfnvbvars.view == 'demo' ? 'data-tooltip="Unavailable in Demo"' : '' )+' href="#"><span class="btn-wrapper">Save</span></a> <a class="mfn-btn btn-modal-close" href="#"><span class="btn-wrapper">Cancel</span></a> </div></div></div>');

        $('.btn-modal-close').on('click', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-confirm.show').remove();
        });

        $('.btn-modal-confirm').on('click', function(e){
            e.preventDefault();
            let $button = $(this);
            $('.mfn-global-section-name').removeClass('error');
            if( $('.mfn-global-section-name').val() != '' ){

                if( $button.hasClass('loading') ) return;
                $button.addClass('loading');

                let pf = prepareForm( uid );

                $.ajax({
                url: mfnajaxurl,
                data: {
                    action: 'mfnconverttoglobal',
                    'mfn-builder-nonce': wpnonce,
                    name: $('.mfn-global-section-name').val(),
                    sections: pf
                },
                type: 'POST',
                success: function(response){
                    /*console.log(response);
                    console.log(mfnDbLists);*/

                    $button.removeClass('loading');

                    if( typeof mfnDbLists['global_sections'] !== 'undefined' && mfnDbLists['global_sections'].length < 2 ){
                        mfnDbLists['global_sections'] = { '0': '- Default -' };
                    }

                    mfnDbLists['global_sections'][response.key] = response.title;

                    GlobalSections.selectedUid = uid;
                    GlobalSections.selectedSectionTemplate = response.key;
                    GlobalSections.sectionTriggered = $content.find(`.section[data-uid=${uid}]`);

                    $edited_div = $content.find(`.section[data-uid=${uid}]`);

                    GlobalSections.getGlobalSection();

                    $('.mfn-ui').removeClass('mfn-modal-open');
                    $('.modal-confirm.show').remove();

                }
            });

            }else{
                $('.mfn-global-section-name').addClass('error');
            }
        });


    },

    setSidebarClass: function() {
        // Set sidebar class, hide options not dedicated for globals | => void

        if ( $(this.sectionTriggered).hasClass('mfn-global-section') ) {
            $('.sidebar-panel').addClass('mfn-global-section-edit');
            $('#global_sections_select').find(`option[value="${ $(this.sectionTriggered).attr('data-mfn-global')}"]`).attr('selected', 'selected');
        } else {
            $('#global_sections_select').find(`option:first-child`).attr('selected', 'selected');
            $('.sidebar-panel').removeClass('mfn-global-section-edit');
        }
    },

    getGlobalSection: function () {
        // Replace actual wrap with global wrap | => void
        const that = this;
        that.sectionTriggered.addClass('mfn-global-section').attr('data-section', that.selectedUid);

        $.ajax({
            url: mfnajaxurl,
            data: {
                action: 'importtemplate',
                'mfn-builder-nonce': wpnonce,
                isGlobalSection: true,
                id: that.selectedSectionTemplate //template id
            },
            type: 'POST',
            success: function(response){
                // Imported content, insert it
                if ( response === '0' ) return that.resetSectionToDefaults();

                that.sectionTriggered = $(that.sectionTriggered).replaceWith(response.html);

                // Info for bebuilder, to know what is being saved
                $.each(response.form, function(i, el) {
                    mfnvbvars.pagedata.push(el);
                });

                // Find and bind the newly inserted section
                let newClass = response.html.match(that.regex)[0];
                that.sectionTriggered = $content.find(`.${newClass}`);

                // CSS related
                that.injectStylesheet();

                // Force display of lists
                backToWidgets();

                // Remaining Lukas stuff
                blink();
                mfnChart();
                historyStorage.add();
                runAjaxElements();
            }
        });
    },

    injectStylesheet: function () {
        // While loading the stylesheet again, prevent loading CSS once more | => void
        if( !this.loadedPostsId.includes( this.selectedSectionTemplate ) ) {
            this.loadedPostsId.push( this.selectedSectionTemplate );
            $content.find('head').append(`<link rel="stylesheet" type="text/css" href='${mfn.site_url}/wp-content/uploads/betheme/css/post-${this.selectedSectionTemplate}.css' />`);
        }
    },

    fillSectionInfo: function( sectionClass, target ) {
        // Fill wrap info to be able to edit it | => void
        this.selectedUid = sectionClass.substring(12, sectionClass.length);
        this.selectedSectionTemplate = $(target).val();
        this.sectionTriggered = $content.find(`.section[data-uid=${this.selectedUid}]`);
    },

    fillSectionInfoWithoutCut: function(sectionUid, target) {
        // Fill wrap info to be able to edit it | => void
        this.selectedUid = sectionUid;
        this.selectedSectionTemplate = target;
        this.sectionTriggered = $content.find(`.section[data-uid=${this.selectedUid}]`);
    },

    resetSectionToDefaults: function() {
        // Create new wrap, replace the global wrap | => void
        const newWrap = elements.section();

        this.sectionTriggered.replaceWith(newWrap.html);
        this.sectionTriggered = $content.find(`.section[data-uid=${newWrap.uid}]`);

        blink();
        historyStorage.add();

        queueMicrotask(() => openEditForm.do( this.sectionTriggered ));
    },
}


$editpanel.on('change', '.global_sections_select', function(e) {
    const sectionClass = $(this).closest('.mfn-element-fields-wrapper').attr('data-element'); // mcb-wrap-uid
    const uidSelected = sectionClass.substring(9, sectionClass.length); //cut mcb-wrap, get the uid only
    const templateSelected = $(e.target); //dropdown, select template

    $edited_div = $content.find(`.section[data-uid=${uidSelected}]`);

    GlobalSections.fillSectionInfo(sectionClass, templateSelected);

    if( !templateSelected.val() ) {
        return GlobalSections.resetSectionToDefaults();
    }

    GlobalSections.getGlobalSection();
})

$('.shortcutsinfo-open').on('click', function(e) {
    e.preventDefault();
    $('.modal-shortcuts').addClass('show');
});

$('.dynamicdatainfo-open').on('click', function(e) {
    e.preventDefault();
    $('.modal-dynamic-data-info').addClass('show');
    $('.modal-dynamic-data-info .modalbox-content li').removeClass('copied');
});

$('.modal-dynamic-data-info .modalbox-content a').on('click', function(e) {
    e.preventDefault();
    const {target} = e;
    const dynamicDataCodeLocation = $(target).closest('li').find('.mfn-dd-label');

    $(target).closest('li').addClass('copied').siblings().removeClass('copied');

    var code = dynamicDataCodeLocation.text();
    //navigator.clipboard.writeText( code );
});

$('.mfn-option-dropdown.btn-save-action a').on('click', function(e) {e.preventDefault();});

// export / import

$('.mfn-export-import-opt').on('click', function(e) {
    e.preventDefault();
    $('.mfn-export-import-opt').removeClass('active');
    $(this).addClass('active');
    $(".panel").hide();
    $('.export-import-current').text($(this).text());
    let filtr = $(this).data('filter');
    if( filtr == 'panel-export-import-presets' ){
        $('#export-presets-data-textarea').val( JSON.stringify(mfnvbvars.presets.filter( (it) => it.type == 'custom' )) );
    }
    $('.'+filtr).show();
});

$('.mfn-export-button').on('click', function(e) {
    e.preventDefault();

    if(!$(this).hasClass('mfn-icon-check-blue')){
        $('.mfn-export-field').select();
        document.execCommand("copy");
        $(this).find('span').text('Copied').addClass('mfn-icon-check-blue');
        localStorage.setItem( 'mfn-builder', JSON.stringify({
          clipboard: $('.mfn-export-field').val()
        }) );
    }
});

$('.mfn-items-import-template li').on('click', function() {
    $('.mfn-items-import-template li').removeClass('active');
    $(this).addClass('active');
});

$('.mfn-export-cancel').on('click', function(e) {
    e.preventDefault();
    backToWidgets();
});

function handlePaste (e) {
    var clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    if( !pastedData && JSON.parse(localStorage.getItem('mfn-builder')).clipboard ){
        pastedData = JSON.parse(localStorage.getItem('mfn-builder')).clipboard;
    }

    $('#import-data-textarea').val(pastedData);
}

if( $('#import-data-textarea').length ) document.getElementById('import-data-textarea').addEventListener('paste', handlePaste);

// pre built sections

$('.pre-built-opt').on('click', function(e) {
    e.preventDefault();
    $('.pre-built-opt').removeClass('active');
    $(this).addClass('active');
    $('.pre-built-current').text($(this).text());
    let filtr = $(this).data('filter');

    $('.mfn-visualbuilder .sidebar-panel-content ul.prebuilt-sections-list li').hide();
    $('.mfn-visualbuilder .sidebar-panel-content ul.prebuilt-sections-list li.'+filtr).show();
});

// header preview

var headerTmpl = {
    confirm: '<div class="mfn-modal modal-confirm modal-header-sticky show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-delete"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Sticky Header</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close btn-modal-abort" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <h3>Building mode</h3> <p>By default, sticky header is same as the default one. If you want to customize it, please choose one of the following options:</p><a class="mfn-btn btn-wide btn-modal-duplicate" href="#"><span class="btn-wrapper">Copy default</span></a> <a class="mfn-btn btn-wide btn-modal-build-new" href="#"><span class="btn-wrapper">Create from scratch</span></a> </div></div></div>',
    init: function() {

        var pageopts = mfnvbvars.pagedata.filter( (item) => item.uid == 'pageoptions' )[0];

        if( typeof pageopts['header_sticky'] != 'undefined' && pageopts['header_sticky'] == 'enabled' ) $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-sticky"]').removeClass('disabled');
        if( typeof pageopts['header_mobile'] != 'undefined' && pageopts['header_mobile'] == 'enabled' ) $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-mobile"]').removeClass('disabled');

        $('.mfn-preview-opt-header').on('click', function(e) {
            e.preventDefault();
            var opt = $(this).attr('data-preview');

            if( opt == 'header-default' ){
                headerTmpl.clickDefault();
            }else if( opt == 'header-sticky' && !$(this).hasClass('disabled') ){
                headerTmpl.clickSticky();
            }else if( opt == 'header-mobile' && !$(this).hasClass('disabled') ){
                headerTmpl.clickMobile();
            }
        });
    },
    clickDefault: function() {
        headerTmpl.resetEmpty();
        $('.mfn-preview-opt-header').removeClass('btn-active');
        elements_ver = 'default';
        $('.mfn-preview-opt-header[data-preview="header-default"]').addClass('btn-active');

        if( $content.find('.mfn-header-tmpl').hasClass('mfn-hasMobile') ){
            $('.sidebar-panel-footer .mfn-preview-opt[data-preview="desktop"]').trigger('click');
        }

        if( !$('.mfn-preview-mode.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-sticky"]').hasClass('btn-active') ) $content.find('body').removeClass('mfn-header-scrolled');
        $content.find('.mfn-header-tmpl').removeClass('mfn-hasMobile');

        checkEmptyPage();
    },
    clickSticky: function() {

        //console.log('sticky click');

        headerTmpl.resetEmpty();

        if( $('.mfn-preview-opt-header[data-preview="header-mobile"]').hasClass('btn-active') ){
            $('.sidebar-panel-footer .mfn-preview-opt[data-preview="desktop"]').trigger('click');
        }

        $('.mfn-preview-opt-header').removeClass('btn-active');
        elements_ver = 'header-sticky';
        $('.mfn-preview-opt-header[data-preview="header-sticky"]').addClass('btn-active');
        $content.find('body').addClass('mfn-header-scrolled');
        $content.find('.mfn-header-tmpl').addClass('mfn-hasSticky');
        $content.find('.mfn-header-tmpl').removeClass('mfn-hasMobile');
        //$('.sidebar-panel-footer .mfn-preview-opt[data-preview="desktop"]').trigger('click');

        if( !$content.find('.mfn-header-tmpl .mfn-header-sticky-section').length ){
            headerTmpl.beforeSticky();
        }
    },
    clickMobile: function() {
        headerTmpl.resetEmpty();
        $('.mfn-preview-opt-header').removeClass('btn-active');
        elements_ver = 'header-mobile';
        $('.mfn-preview-opt-header[data-preview="header-mobile"]').addClass('btn-active');
        $content.find('body').removeClass('mfn-header-scrolled');
        $content.find('.mfn-header-tmpl').addClass('mfn-hasMobile');
        $('.sidebar-panel-footer .mfn-preview-opt[data-preview="mobile"]').trigger('click');
        checkEmptyPage();
    },
    beforeSticky: function() {
        $('.mfn-ui').addClass('mfn-modal-open').append(headerTmpl.confirm);

        $('.modal-header-sticky').on('click', '.btn-modal-abort', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-header-sticky').remove();
            headerTmpl.clickDefault();
        });

        $('.modal-header-sticky').on('click', '.btn-modal-build-new', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-header-sticky').remove();
            checkEmptyPage();
        });

        $('.modal-header-sticky').on('click', '.btn-modal-duplicate', function(e) {
            e.preventDefault();
            $('.mfn-ui').removeClass('mfn-modal-open');
            $('.modal-header-sticky').remove();
            headerTmpl.duplicate();
        });
    },
    duplicate: function(){
        if( $content.find('.mfn-header-tmpl .vb-item.mcb-section.mfn-default-section').length ){
            $content.find('.mfn-header-tmpl .vb-item.mcb-section.mfn-default-section').each(function() {
                var uid = $(this).attr('data-uid');
                copypaste.copy(uid, $content.find('.mfn-header-tmpl-builder'));
            });
        }
        checkEmptyPage();
    },
    resetEmpty: function() {
        if( $('.mfn-header-tmpl .mfn-section-start').length ){
            $('.mfn-header-tmpl .mfn-section-start').remove();
        }
    }
};


// preview

$('.mfn-preview-opt').on('click', function() {
    let preview_type = $(this).data('preview');
    if(!$('body').hasClass('mfn-preview-mode')){ $('body').addClass('mfn-preview-mode'); }
    switchPreview(preview_type);
});

$('.mfn-preview-mode-close').on('click', function(e) {
    e.preventDefault();
    $('body').removeClass('mfn-preview-mode');
    switchPreview('desktop');
    screen = 'desktop';
    $('.mfn-visualbuilder').removeClass('preview-mobile preview-tablet preview-desktop');
});

$editpanel.on('click', '.responsive-switcher li', function() {
    let preview_type = $(this).find('span').attr('data-device');
    switchPreview(preview_type);
    if(preview_type != 'desktop'){ if( !$('body').hasClass('mfn-preview-mode') ) { $('body').addClass('mfn-preview-mode'); } }else{ $('body').removeClass('mfn-preview-mode'); $('.mfn-visualbuilder').removeClass('preview-mobile preview-tablet preview-desktop'); }
});

// dynamic_data dynamic data

var dynamicData = {
    init: function() {

        $editpanel.on('click', '.is_dynamic_data .mfn-button-dynamic-data', function(e) {
            e.preventDefault();

            dynamicData.open($(this));
        });

        $editpanel.on('click', '.modal-dynamic-data:not(.mfn-dd-element-column, .mfn-dd-element-visual) .modalbox-content ul li a', function(e) {
            e.preventDefault();
            let dd_code = $(this).find('.mfn-dd-code').text();
            let type = $(this).attr('data-type');
            let this_val = $editpanel.find('.mfn-current-dynamic-data .mfn-field-value').val();

            $('.modal-dynamic-data').removeClass('show');
            if($editpanel.find('.mfn-current-dynamic-data .mfn-field-value').length) {

                if( type == 'featured_image' ){
                    $editpanel.find('.mfn-current-dynamic-data .mfn-field-value').val(dd_code).trigger('change');
                }else{
                    $editpanel.find('.mfn-current-dynamic-data .mfn-field-value').val(this_val+dd_code).trigger('change');
                }

                $editpanel.find('.mfn-current-dynamic-data').removeClass('mfn-current-dynamic-data');
            }
        });

        $editpanel.on('click', '.modal-dynamic-data .modalbox-content ul li .mfn-dd-copy', function(e) {
            e.preventDefault();
            let $el = $(this);
            let text = $el.siblings('a').find('.mfn-dd-code').html();

            //navigator.clipboard.writeText(text);

            $el.attr('data-tooltip', 'Coppied!');
            setTimeout(function() {
                $el.attr('data-tooltip', 'Copy');
            }, 1000);
        });

        dynamicData.search();
    },

    open: function($ddbutton) {

        let it = $('.mfn-element-fields-wrapper').attr('data-element');

            let label_prefix = 'Page';
            let type = $ddbutton.closest('.mfn-form-row').attr('data-dynamic');

            let $queried = $content.find('.'+it).closest('.mfn-looped-items');

            let dd_query_type = 'posts';
            let dd_posttype = mfnvbvars.post_type;
            label_prefix = dd_posttype;

            let dd_fields = [];

            // reset classes
            $('.modal-dynamic-data').attr('class', 'mfn-modal modal-dynamic-data');

            $('.modal-dynamic-data .mfn-dd-dynamic-ul').empty();
            $('.modal-dynamic-data .mfn-dd-global-ul').empty();

            if( $queried.length ) {
                $('.modal-dynamic-data').addClass('mfn-dd-looped-item');
            }

            $('.modal-dynamic-data').addClass('mfn-dd-'+type);
            $('.modal-dynamic-data').addClass('mfn-dd-element-'+edited_item.jsclass);

            if( $queried.length ){
                let queried_obj = mfnvbvars.pagedata.filter( (item) => item.uid == $queried.attr('data-uid') )[0];

                dd_query_type = typeof queried_obj['attr']['query_type'] !== 'undefined' ? queried_obj['attr']['query_type'] : 'posts';

                if( dd_query_type == 'terms' ){
                    dd_posttype = typeof queried_obj['attr']['query_terms_taxonomy'] !== 'undefined' ? queried_obj['attr']['query_terms_taxonomy'] : 'category';
                    label_prefix = dynamic_data.labels[dd_posttype];
                }else{
                    dd_posttype = typeof queried_obj['attr']['query_post_type'] !== 'undefined' && queried_obj['attr']['query_post_type'] ? queried_obj['attr']['query_post_type'] : 'post';
                    label_prefix = dd_posttype;
                }
            }

            // set dynamic options
            dd_fields = dynamic_data.dynamic[dd_query_type][type];

            if( typeof dynamic_data.dynamic[dd_query_type] !== 'undefined' && typeof dynamic_data.dynamic[dd_query_type][edited_item.type] !== 'undefined' && typeof dynamic_data.dynamic[dd_query_type][edited_item.type][type] !== 'undefined' ){
                dd_fields = dd_fields.concat( dynamic_data.dynamic[dd_query_type][edited_item.type][type] );
            }

            if( dd_posttype != '' && typeof dynamic_data.dynamic[dd_query_type][dd_posttype] !== 'undefined' ){

                if( typeof dynamic_data.dynamic[dd_query_type][dd_posttype][type] !== 'undefined' && dynamic_data.dynamic[dd_query_type][dd_posttype][type].length ) {
                    // dynamic_data.dynamic[dd_query_type][dd_posttype][type].map( (el, i) => $('.modal-dynamic-data .mfn-dd-dynamic-ul').append('<li><span class="mfn-dd-copy" data-tooltip="Copy"><i class="far fa-copy"></i></span><a data-type="'+type+'" href="#"><span class="mfn-dd-label">'+label_prefix+' '+el.label+'</span><span class="mfn-dd-code">{'+el.key+'}</span></a></li>') );
                    dd_fields = dd_fields.concat(dynamic_data.dynamic[dd_query_type][dd_posttype][type]);
                }

            }

            if( dd_fields.length ){
                dd_fields.sort((a,b)=> (a.key > b.key ? 1 : -1));
                dd_fields.map( (el, i) => $('.modal-dynamic-data .mfn-dd-dynamic-ul').append('<li data-name="'+label_prefix+' '+el.label+' '+el.key+'"><span class="mfn-dd-copy" data-tooltip="Copy"><i class="far fa-copy"></i></span><a data-type="'+type+'" href="#"><span class="mfn-dd-label">'+label_prefix+' '+el.label+'</span><span class="mfn-dd-code">{'+el.key+'}</span></a></li>') );
            }

            if( typeof dynamic_data.global[type] != 'undefined' ) {
                dynamic_data.global[type].map( (el, i) => $('.modal-dynamic-data .mfn-dd-global-ul').append('<li><span class="mfn-dd-copy" data-tooltip="Copy"><i class="far fa-copy"></i></span><a data-type="'+type+'" href="#"><span class="mfn-dd-label">'+el.label+'</span><span class="mfn-dd-code">{'+el.key+'}</span></a></li>') );
            }

            //console.log(type);

            if( $editpanel.find('.mfn-current-dynamic-data .mfn-field-value').length ) $editpanel.find('.mfn-current-dynamic-data').removeClass('mfn-current-dynamic-data');
            $ddbutton.closest('.mfn-form-row').addClass('mfn-current-dynamic-data');
            $('.modal-dynamic-data').addClass('show');


            // static options dynamic set
            $('.modal-dynamic-data .modalbox-content .mfn-dd-dynamic-set ul li a').each(function() {
                let subtype = $(this).attr('data-subtype');
                $(this).attr('data-type', type);
                $(this).find('.mfn-dd-code').text('{'+type+subtype+'}');

                if( $(this).closest('.mfn-dd-type-wrapper').hasClass('mfn-dd-type-wrapper-global') && label == 'image' ){
                    // exception for logo
                    $(this).find('.mfn-dd-label span').text('logo');
                }else{
                    $(this).find('.mfn-dd-label span').text(type);
                }

            });

    },

    search: function() {

        $editpanel.on('keyup paste change', '.modal-dynamic-data .modalbox-header .mfn-search', function() {
            var val = $(this).val().toLowerCase();

            if( val.length ){
                if( val.length > 2 ){
                    $(".modal-dynamic-data").addClass('mfn-dynamic-searching');
                    $('.mfn-dd-type-wrapper').addClass('dd-type-hidden');

                    $('.modal-dynamic-data .modalbox-content ul li').hide();
                    $('.modal-dynamic-data .modalbox-content ul li[data-name*="'+val+'"]').closest('.mfn-dd-type-wrapper').show();
                    $('.modal-dynamic-data .modalbox-content ul li[data-name*="'+val+'"]').show();

                    $('.modal-dynamic-data .modalbox-content ul li[data-name*="'+val+'"]').closest('.mfn-dd-type-wrapper').removeClass('dd-type-hidden');

                }else{
                    $(".modal-dynamic-data").removeClass('mfn-dynamic-searching');
                    $('.mfn-dd-type-wrapper').removeClass('dd-type-hidden');

                    $('.modal-dynamic-data .modalbox-content ul li').removeAttr('style');
                    $('.modal-dynamic-data .modalbox-content .mfn-dd-type-wrapper').removeAttr('style');
                }
            }else{
                $(".modal-dynamic-data").removeClass('mfn-dynamic-searching');
                $('.mfn-dd-type-wrapper').removeClass('dd-type-hidden');

                $('.modal-dynamic-data .modalbox-content ul li').removeAttr('style');
                $('.modal-dynamic-data .modalbox-content .mfn-dd-type-wrapper').removeAttr('style');
            }
        });
    }
}

function switchPreview(preview_type) {
    $('.mfn-preview-toolbar .mfn-preview-opt').removeClass('btn-active');
    $('.mfn-preview-toolbar .mfn-preview-opt[data-preview="'+preview_type+'"]').addClass('btn-active');
    $('.mfn-visualbuilder').removeClass('preview-mobile preview-tablet preview-desktop');

    if(preview_type != 'desktop'){
        $('.mfn-visualbuilder').addClass('preview-'+preview_type)
    }

    screen = preview_type;

    setSizeLabels();

    $('.sidebar-panel-footer .btn-change-resolution > a span:first-child').attr('class', 'mfn-icon mfn-icon-'+preview_type);

    if( $content.find('.mfn-current-editing').length && builder_type != 'header' ){
        setTimeout(function() {
            $content.find('html, body').animate({ scrollTop: $edited_div.offset().top - 50 }, 500);
        }, 100);
    }

    if( builder_type == 'header' && elements_ver == 'header-mobile' && screen !== 'mobile' ){
        //$('.mfn-header-type-preview .mfn-preview-opt-header[data-preview="header-default"]').trigger('click');
        $('.mfn-header-type-preview .mfn-preview-opt-header[data-preview="header-default"]').addClass('btn-active');
        $('.mfn-header-type-preview .mfn-preview-opt-header[data-preview="header-mobile"]').removeClass('btn-active');
        elements_ver = 'default';
    }else if( screen == 'mobile' && elements_ver != 'header-mobile' && builder_type == 'header' && !$('.mfn-header-type-preview .mfn-preview-opt-header[data-preview="header-mobile"]').hasClass('disabled') ){
        $('.mfn-header-type-preview .mfn-preview-opt-header[data-preview="header-mobile"]').trigger('click');
    }else if( builder_type == 'header' && elements_ver == 'header-sticky' && screen !== 'mobile' ){
        headerTmpl.clickSticky();
    }

    if( $content.find('.mfn-looped-items-slider-wrapper').length ){
        $content.find('.mfn-looped-items-slider-wrapper').each(function() {
            re_render($(this).attr('data-uid'));
        });
    }

    stickyWrap.reset(true);
    checkEmptyPage();
    runSorting();
}

let be_navigator = {
    init: function() {
        $('.btn-navigator-switcher').on('click', function(e) {
            e.preventDefault();
            be_navigator.open();
        });

        $(document).on('click', '.btn-navigator-hide', function(e) {
            e.preventDefault();
            be_navigator.hide();
        });

        be_navigator.ui();
    },
    show: function(uid, click = false) {
        be_navigator.open();
        setTimeout(function() {
            if( !$navigator.find('li.nav-'+uid).hasClass('active') ){
                if( !$navigator.find('li.nav-'+uid).closest('li.navigator-section').hasClass('active') ){
                    $navigator.find('li.nav-'+uid).closest('li.navigator-section').children('.navigator-arrow').trigger('click');
                }
                if( !$navigator.find('li.nav-'+uid).closest('li.navigator-wrap').hasClass('active') ){
                    $navigator.find('li.nav-'+uid).closest('li.navigator-wrap').children('.navigator-arrow').trigger('click');
                }
                if(!click) {
                    $navigator.find('li.nav-'+uid+' > a').trigger('click');
                }else{
                    $navigator.find('li.nav-'+uid+' > a').addClass('active-element');
                }
            }
        }, 100);
    },
    search: function() {
        $('.mfn-navigator-search-input').on('keyup paste change', function() {
            var val = $(this).val().replace(/ /g, '_').toLowerCase();
            if( val.length ){
                if( val.length > 2 ){
                    $(".mfn-navigator").addClass('mfn-nav-searching');

                    $navigator.find('li').hide();
                    $navigator.find('li.navitemtype[data-name*="'+val+'"]').closest('.navigator-section').show();
                    $navigator.find('li.navitemtype[data-name*="'+val+'"]').closest('.navigator-wrap').show();
                    $navigator.find('li.navitemtype[data-name*="'+val+'"]').parents('.mfn-sub-nav').show();
                    $navigator.find('li.navitemtype[data-name*="'+val+'"]').show();

                }else{
                    $(".mfn-navigator").removeClass('mfn-nav-searching');
                    $navigator.find('li').removeAttr('style');
                    $navigator.find('li:not(.active) > .mfn-sub-nav').removeAttr('style');
                }
            }else{
                $navigator.find('li.navigator-section').show();
                $(".mfn-navigator").removeClass('mfn-nav-searching');
                $navigator.find('li').removeAttr('style');
                $navigator.find('li:not(.active) > .mfn-sub-nav').removeAttr('style');
            }
        });
    },
    open: function() {

        $('.mfn-navigator .navigator-tree').html('');

        if( $builder.find('.section.vb-item').length ){
            $builder.find('.section.vb-item').each(function() {
                let $section = $(this);
                var sect_attr = '';
                if( typeof $section.attr('id') !== 'undefined' ) sect_attr = $section.attr('id');
                if( $section.hasClass('mfn-global-section') ) sect_attr = 'Global';
                $('.mfn-navigator .navigator-tree').append( navigatorHtml('Section', $section.attr('data-uid'), sect_attr ));
                if( !$section.hasClass('mfn-global-section') && $section.find('.wrap.vb-item:not(.mfn-global-wrap)').length ){
                    $('.mfn-navigator .navigator-tree li.nav-'+$section.attr('data-uid')).append('<ul class="mfn-sub-nav"></ul>');
                    let $submenu_section = $('.mfn-navigator .navigator-tree li.nav-'+$section.attr('data-uid')+' .mfn-sub-nav');
                    $section.find('.wrap.vb-item:not(.mfn-global-wrap)').each(function() {
                        let $wrap = $(this);

                        if( $wrap.hasClass('divider') ){
                            $submenu_section.append( navigatorHtml('Divider', $wrap.attr('data-uid'), '') );
                        }else{
                            $submenu_section.append( navigatorHtml('Wrap', $wrap.attr('data-uid'), $wrap.attr('data-desktop-size')) );

                            if( $wrap.find('.column.vb-item').length ){
                                $('.mfn-navigator .navigator-tree li.nav-'+$wrap.attr('data-uid')).append('<ul class="mfn-sub-nav"></ul>');
                                let $submenu_wrap = $('.mfn-navigator .navigator-tree li.nav-'+$wrap.attr('data-uid')+' .mfn-sub-nav');

                                $wrap.find('.column.vb-item').each(function() {
                                    let $item = $(this);
                                    let itemObj = mfnvbvars.pagedata.filter( (item) => item.uid == $item.attr('data-uid') )[0];
                                    $submenu_wrap.append( navigatorHtml(itemObj.jsclass, $item.attr('data-uid'), $item.attr('data-desktop-size')) );
                                });
                            }
                        }

                    });
                }
            });
        }

        if( !$('body').hasClass('mfn-navigator-active') ) $('body').addClass('mfn-navigator-active');
    },
    ui: function() {
        $(".mfn-navigator").draggable({
            handle: ".modalbox-header"
        });

        $( ".mfn-navigator" ).resizable({
          maxHeight: winH,
          maxWidth: 600,
          minHeight: 300,
          minWidth: 250
        });

        $(document).on('click', '.mfn-navigator .navigator-tree li .navigator-arrow', function(e) {
            var $li = $(this).closest('li');

            if( $li.hasClass('navigator-section') && !$li.hasClass('active') ){
                $('.mfn-navigator .navigator-tree li.active').find('ul').slideUp();
                $('.mfn-navigator .navigator-tree li.active').removeClass('active');
            }

            if( !$li.hasClass('active') ){
                $li.children('ul').slideDown(function() {
                    $li.addClass('active');
                });
            }else{
                $li.children('ul').slideUp(function() {
                    $li.removeClass('active');
                });
            }
            if( $navigator.hasClass('mfn-nav-searching') ){
                $navigator.find('li').removeAttr('style');
                $navigator.find('li:not(.active) > .mfn-sub-nav').removeAttr('style');
                $navigator.removeClass('mfn-nav-searching');
            }
        });

        $(document).on('click', '.mfn-navigator .navigator-tree li a', function(e) {
            e.preventDefault();
            var uid = $(this).attr('data-uid');
            $edited_div = $content.find('.vb-item[data-uid="'+uid+'"]');

            if( $('.mfn-navigator li a.active-element').length ){
                $('.mfn-navigator li a').removeClass('active-element');
            }

            //Global section, prevent opening edit form, leave scroll only
            if( !$(this).closest('.toggle-disabled').length ) {
                openEditForm.do($edited_div, true);
            } else {
                backToWidgets();
            }

            $content.find('html, body').animate({ scrollTop: $edited_div.offset().top - 50 }, 1000);

            $(this).addClass('active-element');
        });

    },
    hide: function() {
        $('body').removeClass('mfn-navigator-active');
    }
}
be_navigator.init();

// end preview

// revisions

$('.mfn-revisions-opt').on('click', function(e) {
    e.preventDefault();
    $('.mfn-revisions-opt').removeClass('active');
    $(this).addClass('active');
    $(".panel").hide();
    $('.revisions-current').text($(this).text());
    let filtr = $(this).data('filter');
    $('.'+filtr).show();
});


$('.sidebar-panel #mfn-widgets-list .mfn-search').on('focus', function() {
    $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').show();
    $('.mfn-filter-items').removeClass('active');
    $('.mfn-filter-items[data-filter="all"]').addClass('active');
    $('.filter-items-current').text($('.mfn-filter-items[data-filter="all"]').text());
});

var options = {
  valueNames: [ 'title' ]
};

var userList = new List('mfn-widgets-list', options);

var optionsicons = {
  valueNames: [ 'titleicon' ]
};

var iconsList = new List('modal-select-icon', optionsicons);

// filter items

$('.mfn-filter-items').on('click', function(e) {
    e.preventDefault();
    $('.mfn-filter-items').removeClass('active');
    $(this).addClass('active');
    $('.filter-items-current').text($(this).text());
    let filtr = $(this).data('filter');

    $('.sidebar-panel #mfn-widgets-list .mfn-search').val('');
    userList.search();

    if(filtr == 'all'){
        $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').show();
    }else{
        $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li').hide();
        $('.mfn-visualbuilder .sidebar-panel-content ul.items-list li.'+filtr).show();
    }
});

// back to widgets

$("li.menu-items a ").on('click', function(e) {
    e.preventDefault();
    backToWidgets();
});
$('.back-to-widgets').on('click', function(e) {
    e.preventDefault();
    backToWidgets();
});

// close modal icon

$editpanel.on('click', '.mfn-modal .btn-modal-close', function(e) {
    e.preventDefault();
    $(this).closest('.mfn-modal').removeClass('show');
    if( !$('.mfn-modal.show').length ){
        $('.mfn-ui').removeClass('.mfn-modal-open');
        $('body').removeClass('.mfn-modal-open');
    }
});

// modal icon

$('.mfn-ui .modal-select-icon .modalbox-search .mfn-form-select').on('change', function() {
    let choosed = $(this).val();
    if( $('.mfn-ui .modal-select-icon .modalbox-search .mfn-search').val() != '' ){
        $('.mfn-ui .modal-select-icon .modalbox-search .mfn-search').val('');
        iconsList.search();
    }
    $('.mfn-ui .modal-select-icon .modalbox-content ul.mfn-items-list li').hide();
    $('.mfn-ui .modal-select-icon .modalbox-content ul.mfn-items-list li.'+choosed).show();
});

// show prebuilts

$(".sidebar-menu ul li.menu-sections a ").on('click', function(e) {
    e.preventDefault();
    showPrebuilts();
    // resetSaveButton();
});

// show revisions

$(".sidebar-menu ul li.menu-revisions a ").on('click', function(e) {
    e.preventDefault();
    if( mfnvbvars.view == 'demo' ) return;

    $(".panel").hide();
    $(".header").hide();
    $(".panel-revisions").show();
    $(".header-revisions").show();
    $('.mfn-revisions-opt').removeClass('active');

    $('.mfn-revisions-opt').first().trigger('click');
    // resetSaveButton();
});

// show import export
$(".sidebar-menu ul li.menu-export a ").on('click', function(e) {
    e.preventDefault();
    if( mfnvbvars.view == 'demo' ) return;
    $('.mfn-export-import-opt').removeClass('active');
    updateExportInput();
    $(".panel").hide();
    $(".header").hide();
    $('.export-import-current').text($('.mfn-export-import-opt').first().text());
    $('.mfn-export-import-opt').first().addClass('active');
    $(".panel-export-import").show();
    $(".header-export-import").show();
    // resetSaveButton();
});

// show single page import
$(".sidebar-menu ul li.menu-page a ").on('click', function(e) {
    e.preventDefault();
    if( mfnvbvars.view == 'demo' ) return;
    $('.mfn-export-import-opt').removeClass('active');
    $(".panel").hide();
    $(".header").hide();
    $('.export-import-current').text($('.mfn-export-import-opt[data-filter="panel-export-import-single-page"]').text());
    $('.mfn-export-import-opt[data-filter="panel-export-import-single-page"]').addClass('active');
    $(".panel-export-import-single-page").show();
    $(".header-export-import").show();
    // resetSaveButton();
});

// show settings
$('.mfn-settings-tab').on('click', function(e) {
    e.preventDefault();
    if (mfnvbvars.view == 'demo') return;

    $('.mfn-ui').addClass('mfn-sidebar-hidden-footer');

    $(".panel").hide();
    $(".header").hide();
    $(".panel-settings").show();
    $(".header-settings").show();
    // resetSaveButton();
});

// show view options
$('.mfn-view-options-tab').on('click', function(e) {
    e.preventDefault();
    if (mfnvbvars.view == 'demo') return;

    $(".panel").hide();
    $(".header").hide();
    $(".panel-view-options").show();
    $(".header-view-options").show();
    edited_item = mfnvbvars.pagedata.filter( (item) => item.uid == 'pageoptions' )[0];
    //$('.mfn-ui .panel-view-options .mfn-form.mfn-form-options').html( mfnDbLists.pageoptions( edited_item ) );

    // console.log(edited_item);

    const mfn_form_po = new MfnForm( mfnDbLists.pageoptions );
    let form_html = mfn_form_po.render();
    $('.mfn-ui .panel-view-options .mfn-form.mfn-form-options').html('<div class="page-options-form-wrapper">'+form_html+'</div>');

    onOpenEditForm();
    mfnoptsinputs.start();
    MfnFieldTextarea.initForCSSandJS();

    if( $('.mfn-slider-input').length ){
        $('.mfn-slider-input input.mfn-form-input').on('mouseenter', function() {
            $(this).inputDrag();
        });
    }

    /**
     * Slider bar
    * */

    if( $('.panel-view-options .mfn-form .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').length ){
        $('.panel-view-options .mfn-form .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').each(function() {
            sliderInput.init($(this));
        });
    }
});

$(document).on('click', '.mfn-copytoclipboard', function(e) {
    e.preventDefault();

    if( typeof $(this).attr('data-clipboard') === 'undefined' ) return;
    let cb = $(this).attr('data-clipboard');
    let $link = $(this);
    navigator.clipboard.writeText(cb);
    $link.attr('data-tooltip', 'Copied');

    setTimeout(function() {
        $link.attr('data-tooltip', 'Click to copy to clipboard');
    }, 3000);
});

$(document).on('click', '.sidebar-menu-inner ul li:not(.menu-wordpress) a', function() {

    if( $(this).hasClass('mfn-settings-tab') ){
        $('.mfn-ui').addClass('mfn-sidebar-hidden-footer');
    }else{
        $('.mfn-ui').removeClass('mfn-sidebar-hidden-footer');
    }

    if( $builder.find('.mfn-current-editing').length ) $builder.find('.mfn-current-editing').removeClass('mfn-current-editing');
});

// theme options [themeoptions]

var sidebar_themeoptions = {
    init: function() {

        $('.sidebar-menu ul li.menu-themeoptions a').on('click', function(e) {
            e.preventDefault();
            if (mfnvbvars.view == 'demo') return;

            if( $builder.find('.mfn-current-editing').length ) $builder.find('.mfn-current-editing').removeClass('mfn-current-editing');

            $('.mfn-ui .panel-view-themeoptions .mfn-form.mfn-form-themeoptions').empty();
            let $tabler = $('.panel-view-themeoptions .vb-themeoptions');
            $(".panel").hide();
            $(".header").hide();
            $(".panel-view-themeoptions").show();
            $(".header-themeoptions").show();

            sidebar_themeoptions.startView();

            edited_item = mfnDbLists.themeoptions;
            edited_item['jsclass'] = 'themeoption';
            $('.mfn-ui .panel-view-themeoptions .mfn-form.mfn-form-themeoptions').html( renderMfnFields.themeoptions( edited_item ) );

            // console.log(edited_item);

        });

        $editpanel.on('click', '.header-themeoptions .header-to-back a', function(e) {
            e.preventDefault();
            if( $('.vb-themeoptions .vb-to.active').length ){
                //$('.vb-themeoptions .vb-to.active').removeClass('active');
                $('.vb-themeoptions').removeClass('vb-to-form-view');
                $('.header-to-back').hide();
                if( $('.vb-themeoptions .vb-to-content.vb-to-active').length ) $('.vb-themeoptions .vb-to-content.vb-to-active').removeClass('vb-to-active');
                if($('.vb-themeoptions .vb-to-li-active').length) $('.vb-themeoptions .vb-to-li-active').removeClass('vb-to-li-active');
            }
        });

        $editpanel.on('click', '.vb-themeoptions .vb-to-header a', function(e) {
            e.preventDefault();
            var $tab = $(this).closest('.vb-to');
            var $tabler = $(this).closest('.vb-themeoptions');
            var href = $(this).attr('href');
            var id = href.replace('#themeoptions-', '');

            if( $(this).hasClass('vb-themeoptions-link-expander') ){
                if( $tab.hasClass('active') ){
                    $tab.removeClass('active');
                    $tabler.removeClass('vb-to-form-view');
                    if( $tabler.find('.vb-to-content.vb-to-active').length ) $tabler.find('.vb-to-content.vb-to-active').removeClass('vb-to-active');
                }else{
                    $tab.addClass('active');
                    if( href == '#themeoptions-gdpr' && $('.mfn-form-themeoptions .themeoption.gdpr input:checked').val() == '1' ){
                        if( $content.find('#mfn-gdpr').length ) $content.find('#mfn-gdpr').addClass('show');
                    }
                }
            }else if( $(this).hasClass('vb-themeoptions-form-link') ){
                if($tabler.hasClass('vb-to-form-view')) {
                    $tabler.removeClass('vb-to-form-view');
                    $('.header-to-back').hide();
                    if($tabler.find('.vb-to-li-active').length) $tabler.find('.vb-to-li-active').removeClass('vb-to-li-active');
                    if( $tabler.find('.vb-to-content.vb-to-active').length ) $tabler.find('.vb-to-content.vb-to-active').removeClass('vb-to-active');
                }else{
                    if($tabler.find('.vb-to-active').length) $tabler.find('.vb-to-active').removeClass('vb-to-active');
                    if($tabler.find('.vb-to-li-active').length) $tabler.find('.vb-to-li-active').removeClass('vb-to-li-active');
                    $('.header-to-back').show();
                    $tabler.addClass('vb-to-form-view');
                    $tab.find(href).addClass('vb-to-active');

                    if( !$tab.find(href+' .mfn-form-row').length ){

                        const mfn_form_to = new MfnForm( renderMfnFields['themeoptions_fields'][id] );
                        let form_html_to = mfn_form_to.render();

                        $tab.find(href).html(form_html_to);
                    }

                    mfnoptsinputs.start();
                    if( $('.panel-view-themeoptions .mfn-form .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').length ){
                        $('.panel-view-themeoptions .mfn-form .mfn-vb-formrow .sliderbar:not(.mfn-initialized)').each(function() {
                            sliderInput.init($(this));
                        });
                    }
                    initSocialSorting($tab);
                    initFontSelect($tab);
                    MfnFieldTextarea.initForCSSandJS();
                    $(this).parent('li').addClass('vb-to-li-active');
                }
            }

        });
    },

    startView: function() {
        let $tabler = $('.panel-view-themeoptions .vb-themeoptions');

        if( $tabler.find('.vb-to.active') ) $tabler.find('.vb-to.active').removeClass('active');
        if( $tabler.hasClass('vb-to-form-view') ) $tabler.removeClass('vb-to-form-view');
        if( $tabler.find('.vb-to-li-active').length ) $tabler.find('.vb-to-li-active').removeClass('vb-to-li-active');
        if( $tabler.find('.vb-to-content.vb-to-active').length ) $tabler.find('.vb-to-content.vb-to-active').removeClass('vb-to-active');
    }
}

sidebar_themeoptions.init();


/**
 * MEGA MENU
 * */

$editpanel.on('change', '.mfn-be-megamenu-builder .panel-view-options .preview-megamenu_custom_widthinput', function() {
    $content.find('.mfn-megamenu-wrapper').css('width', $(this).val());
});

$editpanel.on('change', '.mfn-be-megamenu-builder .panel-view-options .preview-megamenu_widthinput', function() {
    var val = $(this).val();
    $content.find('.mfn-megamenu-wrapper').removeClass('mfn-megamenu-full-width');
    if( val == 'custom-width' ) {
        $content.find('.mfn-megamenu-wrapper').css('width', $('.mfn-be-megamenu-builder .panel-view-options .preview-megamenu_custom_widthinput').val());
    }else if( val == 'full-width' ) {
        $content.find('.mfn-megamenu-wrapper').removeAttr('style');
        $content.find('.mfn-megamenu-wrapper').addClass('mfn-megamenu-full-width')
    }else{
        $content.find('.mfn-megamenu-wrapper').removeAttr('style');
    }
});

/**
 * END MEGA MENU
 * */

function updateExportInput(){
    if( mfnvbvars.view == 'demo' ) return;
    var formData = prepareForm();

    $('.panel-export-import .mfn-export-field').val(formData);
}

/*$(document).ajaxComplete(function() {
    runAjaxElements();
});*/

function runAjaxElements(){

    // vb tools
    runSorting();

    // query loop masonry
    if( $content && $content.find('.mfn-query-loop-masonry:not(.mfn-initialized)').length ){
      // queryLoopMasonry();
        iframe.queryLoopMasonry();
    }

    // blog slider
    if($content && $content.find('.blog_slider .blog_slider_ul:not(.slick-initialized)').length){
        mfnSliderBlog();
    }
    // clients slider
    if($content && $content.find('.clients_slider_ul').length){
        mfnSliderClients();
    }

    // gallery
    if($content && $content.find('.sections_group .gallery, .mcb-section .gallery').not('.mfn-initialized').length){
        //mfnGalleryInit();
        iframe.msnryGalleryInit();
    }

    // countdown
    if($content && $content.find('.downcount').length){
        mfnCountDown();
    }

    // chart
    if($content && $content.find('.chart_box:not(.mfn-initialized)').length){
        mfnChart();
    }

    // counter

    if($content && $content.find('.animate-math .number').length){
        mfnAnimateMath();
    }

    // slider

    if($content && $content.find('.content_slider_ul').length){
        sliderSlider();
    }

    // accordion
    if($content && $content.find('.mfn-acc').length){
        accordionifaqs();
    }

    if($content && $content.find('.woocommerce-product-attributes').length){
        spanToAdditionalInfo();
    }

    if( $content && $content.find('.promo_bar_slider:not(.mfn-initialized)').length ){
      promoBarSlider();
    }

    if( $content && $content.find('.mcb-wrap.sticky:not(.stickied)').length ){
        stickyWrap.init();
    }

    // feature list

    if($content && $content.find('.feature_list').length){
        mfnFeatureList();
    }

    // hover box

    if($content && $content.find('.tooltip, .hover_box').length){
        mfnHoverBox();
    }
    // slider offer full

    if($content && $content.find('.offer_ul').length){
        mfnSliderOffer();
    }

    if($content && $content.find('.blog_wrapper .isotope:not( .masonry ), .portfolio_wrapper .isotope:not( .masonry-flat, .masonry-hover, .masonry-minimal').length){
        portfolioIsotope();
    }

    if( $content && $content.find('.mfn-language-switcher-dropdown:not(.mfn-initialized)').length ) {
        wpmlLangSwitcher();
    }

    if($content && $content.find('.isotope.masonry, .isotope.masonry-hover, .isotope.masonry-minimal').length){
        blogPortfolioMasonry();
    }

    // slider testimonials

    if($content && $content.find('.testimonials_slider_ul').length){
        sliderTestimonials();
    }

    // slider offer thumb

    if($content && $content.find('.offer_thumb_ul:not(.slick-initialized)').length){
        mfnSliderOfferThumb();
    }

    if($content && $content.find('.shop_slider_ul').length){
        mfnSliderShop();
    }

    // product gallery

    if( $content && $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery:not(.mfn-initialized)').length ){
        productgallery.start( $content.find('.mcb-item-product_images-inner .woocommerce-product-gallery:not(.mfn-initialized)') );
    }

    // portfolio slider

    if($content && $content.find('.portfolio_slider_ul').length){
        sliderPortfolio();
    }

    // before after

    if($content && $content.find('.before_after.twentytwenty-container').length){

        $content.find('.before_after.twentytwenty-container .twentytwenty-overlay').remove();
        $content.find('.before_after.twentytwenty-container .twentytwenty-after-label').remove();
        $content.find('.before_after.twentytwenty-container .twentytwenty-handle').remove();

        $content.find('.before_after.twentytwenty-container').imagesLoaded(function() {
            $content.find('.before_after.twentytwenty-container').twentytwenty();
            $content.find('.before_after.twentytwenty-container').not('mfn-initialized').addClass('mfn-initialized');
        });
    }
    // tabs
    if($content && $content.find('.jq-tabs:not(.ui-tabs)').length){
        $content.find('.jq-tabs:not(.ui-tabs) ul li a').each(function() { $(this).attr("href", location.href.toString().replace('#', '')+$(this).attr("href")); }); // prevents tab reload iframe from jquery 1.9, 1.8 is ok
        $content.find('.jq-tabs:not(.ui-tabs)').tabs();
    }

    // edit view for new widget
    if($content && $builder.find('.mfn-new-item .mfn-element-edit').length){

        if( !$builder.find('.mfn-new-item').hasClass('column_placeholder') ) $builder.find('.mfn-new-item .mfn-element-edit').trigger('click');
        $builder.find('.mfn-new-item').removeClass('mfn-new-item');

    }
}





// reinit js

// accordion & faq


function accordionifaqs(){
    $content.find('.mfn-acc').each(function() {
      var el = $(this);

      if (el.hasClass('openAll')) {

        // show all
        el.find('.question')
          .addClass("active")
          .children(".answer")
          .show();

      } else {

        // show one
        var activeTab = el.attr('data-active-tab');
        if (el.hasClass('open1st')) activeTab = 1;

        if (activeTab) {
          el.find('.question').eq(activeTab - 1)
            .addClass("active")
            .children(".answer")
            .show();
        }

      }
    });
}

// chart

function mfnChart(){
    $content.find('.chart_box:not(.mfn-initialized)').each(function() {
        var chart_html = $(this).html();

        var $box = $(this).closest('.mcb-column');

        $(this).html(chart_html);

        var $el = $(this).children('.chart');

        var line_width = $el.data('line-width');
        var line_percent = $el.data('percent');


        $el.easyPieChart({
          animate: 1000,
          lineCap: 'circle',
          lineWidth: line_width,
          size: 140,
          scaleColor: false
        });


        if($(this).find('canvas').length > 1){ $(this).find('canvas').first().remove(); }

        $(this).addClass('mfn-initialized');

    });
}

// counter, Quick Fact

function mfnAnimateMath(){
    $content.find('.animate-math .number').waypoint({

      offset: '100%',
      triggerOnce: true,
      handler: function() {

        var el = $(this.element).length ? $(this.element) : $(this);
        var duration = Math.floor((Math.random() * 1000) + 1000);
        var to = el.attr('data-to');

        $({
          property: 0
        }).animate({
          property: to
        }, {
          duration: duration,
          easing: 'linear',
          step: function() {
            el.text(Math.floor(this.property));
          },
          complete: function() {
            el.text(this.property);
          }
        });

        if (typeof this.destroy !== 'undefined' && $.isFunction(this.destroy)) {
          this.destroy();
        }
      }

    });
}

/**
* FIX | Header | Sticky | Height
*/

function fixStickyHeaderH() {

var stickyH = 0;

// FIX | sticky top bar height

var topBar = $content.find('.sticky-header #Top_bar');

if (topBar.hasClass('is-sticky')) {
  stickyH = $content.find('.sticky-header #Top_bar').innerHeight() || 0;
} else {
  topBar.addClass('is-sticky');
  stickyH = $content.find('.sticky-header #Top_bar').innerHeight() || 0;
  topBar.removeClass('is-sticky');
}

// FIX | responsive

if ( $(window).width() < mobileInitW ) {

  if ( $(window).width() < 768 ) {

    // mobile
    if (!$content.find('body').hasClass('mobile-sticky')) {
      stickyH = 0;
    }

  } else {

    // tablet
    if (!$content.find('body').hasClass('tablet-sticky')) {
      stickyH = 0;
    }

  }

} else {

  // desktop

  // FIX | header creative
  if ($content.find('body').hasClass('header-creative')) {
    stickyH = 0;
  }

}

return stickyH;
}


/**
* Sticky | Wrap
*/

var stickyWrap = {

headerH: 0,

// stickyWrap.init()

init: function(){

  // calculate

  stickyWrap.headerH = fixStickyHeaderH();

  // prepare dom

  if( !$content.find('.mcb-wrap.sticky.sticky-'+screen+':not(.stickied)').length ) return;

  $content.find('.mcb-wrap.sticky.sticky-'+screen+':not(.stickied)').each(function(){

    var $wrap = $(this);

    if( screen == 'desktop' && $wrap.hasClass('one') ) return;
    if( screen == 'tablet' && $wrap.hasClass('tablet-one') ) return;
    if( screen == 'mobile' && $wrap.hasClass('mobile-one') ) return;

    var size = $wrap.attr('data-'+screen+'-col'),
      padding = {
        top : $wrap.css('padding-top'),
        right : $wrap.css('padding-right'),
        bottom : $wrap.css('padding-bottom'),
        left : $wrap.css('padding-left'),
      };

    padding = Object.values(padding).join(' ');

    $wrap.css('padding', padding);

    $wrap.addClass('stickied').removeClass(size.desktop+' '+size.mobile+' '+size.tablet).addClass('one')
    .wrap(function() {
      return '<div class="mcb-wrap wrap-sticky-spacer ' + size + '"><div class="mcb-wrap wrap-sticky-rails"></div></div>';
    });

  });

  // initial scroll

  stickyWrap.scroll();

},

// stickyWrap.scroll()

scroll: function(){

  if( ! $content.find('.mcb-wrap.sticky.sticky-'+screen).length ){
    return;
  }

  var windowY = $(window).scrollTop();

  $content.find('.mcb-wrap.sticky.sticky-'+screen).each(function(){

    var $wrap = $(this),
      $rails = $wrap.closest('.wrap-sticky-rails'),
      $section = $wrap.closest('.mcb-section-inner');

    if( screen == 'desktop' && $wrap.hasClass('one') ) return;
    if( screen == 'tablet' && $wrap.hasClass('tablet-one') ) return;
    if( screen == 'mobile' && $wrap.hasClass('mobile-one') ) return;

    var width = $rails.width() || 0,
      sectionT = $section.offset().top,
      sectionH = $section.innerHeight(),
      wrapH = $wrap.outerHeight();

    var start = windowY + stickyWrap.headerH - sectionT,
      limit = start + wrapH - sectionH;

    $wrap.css( 'width', width )
      .closest('.wrap-sticky-rails').css('min-height', sectionH + 'px');

    if( limit > 0 ){

      $wrap.removeClass('fixed').addClass('stick-bottom').css({
        'top' : ''
      });

    } else {

      $wrap.removeClass( 'stick-bottom' );

      if( start > 0 ){
        $wrap.addClass('fixed').css({
          'top' : stickyWrap.headerH + 'px'
        });
      } else {
        $wrap.removeClass('fixed').css({
          'top' : ''
        });
      }

    }

  });

},

reset: function(reinit = false) {
    if( $content.find('.wrap-sticky-spacer').length ){
        $content.find('.wrap-sticky-spacer').each(function() {
          $(this).find('.mcb-wrap.sticky').removeClass('stickied one fixed').addClass( $(this).find('.mcb-wrap.sticky').attr('data-'+screen+'-col') ).css({'top': '0', 'width': ''});
          $(this).replaceWith( $(this).find('.mcb-wrap.sticky') );
        });
    }
    if( reinit && $content.find('.mcb-wrap.sticky:not(.stickied)').length ) stickyWrap.init();
}

};

// hover box

function mfnHoverBox(){
    $content.find('.tooltip, .hover_box')
      .on('touchstart', function() {
        $(this).toggleClass('hover');
      })
      .on('touchend', function() {
        $(this).removeClass('hover');
      });
}

// feature list

function mfnFeatureList(){
    $content.find('.feature_list').each(function() {
    $(this).find('hr').remove();
      var col = $(this).attr('data-col') ? $(this).attr('data-col') : 4;
      $(this).find('li:nth-child(' + col + 'n):not(:last-child)').after('<hr />');
    });
}

// countdown
function mfnCountDown(){
    $content.find('.downcount').each(function() {
      var el = $(this);
      el.downCount({
        date: el.attr('data-date'),
        offset: el.attr('data-offset')
      });
    });
}

// Slider | Testimonials

function sliderTestimonials() {

var pager = function(el, i) {
  var img = $(el.$slides[i]).find('.single-photo-img').html();
  return '<a>' + img + '</a>';
};

$content.find('.testimonials_slider_ul').each(function() {

  var slider = $(this);

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',

    adaptiveHeight: true,
    appendDots: slider.siblings('.slider_pager'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.testimonials ? true : false,
    autoplaySpeed: mfn.slider.testimonials ? mfn.slider.testimonials : 5000,

    slidesToShow: 1,
    slidesToScroll: 1
  });

});
}
// header promo bar | Slider

function promoBarSlider() {
    $content.find('.promo_bar_slider').not('.mfn-initialized').each(function() {
        var speed = parseInt($(this).attr('data-speed')) * 1000;

        var $slider = $(this);
        $slider.find( '.pbs_one' ).first().addClass('pbs-active');
        $slider.addClass('mfn-initialized');

        function changeSlide() {
            var $current = $slider.find( '.pbs_one.pbs-active' );
            var $next = $slider.find( '.pbs_one.pbs-active' ).next();
            if( !$next.length ) $next = $slider.find( '.pbs_one' ).first();

            $current.fadeOut(300, function() {
                $next.fadeIn(300);
            });

            //$slider.css('height', $next.outerHeight());
            $current.removeClass('pbs-active');
            $next.addClass('pbs-active');
        }

        if( $slider.find( '.pbs_one' ).length > 1 ){
            setInterval(changeSlide, speed);
        }

    });
}

// Slider | Shop

function mfnSliderShop() {

var pager = function(el, i) {
  return '<a>' + i + '</a>';
};

$content.find('.shop_slider_ul').each(function() {

  var slider = $(this);
  var slidesToShow = 4;

  var count = slider.closest('.shop_slider').data('order');
  if (slidesToShow > count) {
    slidesToShow = count;
    if (slidesToShow < 1) {
      slidesToShow = 1;
    }
  }

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
    appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

    appendDots: slider.siblings('.slider_pager'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.shop ? true : false,
    autoplaySpeed: mfn.slider.shop ? mfn.slider.shop : 5000,

    slidesToShow: slickAutoResponsive(slider, slidesToShow),
    slidesToScroll: slickAutoResponsive(slider, slidesToShow)
  });

  // ON | debouncedresize

  $(window).on('debouncedresize', function() {
    slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, slidesToShow), false);
    slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, slidesToShow), true);
  });

});
}

// Slider | Offer Thumb

function mfnSliderOfferThumb() {

var pager = function(el, i) {
    var img = $content.find( el.$slides[i] ).find('.thumbnail').html();
    return '<a>' + img + '</a>';
};

$content.find('.offer_thumb_ul:not(.slick-initialized)').each(function() {

  var slider = $(this);

  slider.slick({
    cssEase: 'ease-out',
    arrows: false,
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    adaptiveHeight: true,
    appendDots: slider.siblings('.slider_pagination'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.offer ? true : false,
    autoplaySpeed: mfn.slider.offer ? mfn.slider.offer : 5000,

    slidesToShow: 1,
    slidesToScroll: 1
  });

});
}

// Slider | Portfolio

function sliderPortfolio() {

$content.find('.portfolio_slider_ul').each(function() {

  var slider = $(this);
  var size = 380;
  var scroll = 5;

  if (slider.closest('.portfolio_slider').data('size')) {
    size = slider.closest('.portfolio_slider').data('size');
  }

  if (slider.closest('.portfolio_slider').data('size')) {
    scroll = slider.closest('.portfolio_slider').data('scroll');
  }

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: false,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="slider_nav slider_prev themebg" href="#"><i class="icon-left-open-big"></i></a>',
    nextArrow: '<a class="slider_nav slider_next themebg" href="#"><i class="icon-right-open-big"></i></a>',

    rtl: rtl ? true : false,
    autoplay: mfn.slider.portfolio ? true : false,
    autoplaySpeed: mfn.slider.portfolio ? mfn.slider.portfolio : 5000,

    slidesToShow: slickAutoResponsive(slider, 5, size),
    slidesToScroll: slickAutoResponsive(slider, scroll, size)
  });

  // ON | debouncedresize
  $(window).on('debouncedresize', function() {
    slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider, 5, size), false);
    slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider, scroll, size), true);
  });

});
}

// Slider | Offer

function mfnSliderOffer() {
$content.find('.offer_ul').each(function() {

  var slider = $(this);

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: false,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="slider_prev" href="#"><span class="button_icon"><i class="icon-up-open-big"></i></span></a>',
    nextArrow: '<a class="slider_next" href="#"><span class="button_icon"><i class="icon-down-open-big"></i></span></a>',

    adaptiveHeight: true,
    //customPaging  : pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.offer ? true : false,
    autoplaySpeed: mfn.slider.offer ? mfn.slider.offer : 5000,

    slidesToShow: 1,
    slidesToScroll: 1
  });

  // Pagination | Show (css)

  slider.siblings('.slider_pagination').addClass('show');

  // Pager | Set slide number after change

  slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
    slider.siblings('.slider_pagination').find('.current').text(currentSlide + 1);
  });

});
}

// Slider | Slider

function sliderSlider() {

var pager = function(el, i) {
  return '<a>' + i + '</a>';
};

$content.find('.content_slider_ul').each(function() {

  var slider = $(this);
  var count = 1;
  var centerMode = false;

  if (slider.closest('.content_slider').hasClass('carousel')) {
    count = slickAutoResponsive(slider);

    $(window).on('debouncedresize', function() {
      slider.slick('slickSetOption', 'slidesToShow', slickAutoResponsive(slider), false);
      slider.slick('slickSetOption', 'slidesToScroll', slickAutoResponsive(slider), true);
    });
  }

  if (slider.closest('.content_slider').hasClass('center')) {
    centerMode = true;
  }

  slider.not('.slick-initialized').slick({
    cssEase: 'cubic-bezier(.4,0,.2,1)',
    dots: true,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    centerMode: centerMode,
    centerPadding: '20%',

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',

    adaptiveHeight: true,
    appendDots: slider.siblings('.slider_pager'),
    customPaging: pager,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.slider ? true : false,
    autoplaySpeed: mfn.slider.slider ? mfn.slider.slider : 5000,

    slidesToShow: count,
    slidesToScroll: count
  });

  // Lightbox | disable on dragstart

  var clickEvent = false;

  slider.on('dragstart', '.slick-slide a[rel="lightbox"]', function(event) {
    if (lightboxAttr) {
      var events = $._data(this,'events');
      if( events && Object.prototype.hasOwnProperty.call(events, 'click') ){
        clickEvent = events.click[0];
        $(this).addClass('off-click').off('click');
      }
    }
  });

  // Lightbox | enable after change

  slider.on('afterChange', function(event, slick, currentSlide, nextSlide) {
    if (lightboxAttr) {
      $content.find('a.off-click[rel="lightbox"]', slider).removeClass('off-click').on('click', clickEvent);
    }
  });

});
}

// WPML language switcher

function wpmlLangSwitcher() {
    if( $content.find('.mfn-language-switcher-dropdown:not(.mfn-initialized)').length ) {
      $content.find('.mfn-language-switcher-dropdown:not(.mfn-initialized)').each(function() {
        let that = $(this);
        that.addClass('mfn-initialized');

        let $ul = that.find('ul');
        let $current = $ul.find('li.wpml-ls-current-language');

        $current.append($ul.clone());

        $ul.children('li:not(.wpml-ls-current-language)').remove();

        $current.find('ul li.wpml-ls-current-language').remove();

        if( that.hasClass('mfn-language-switcher-dropdown-icon') ){
          let icon_html = '';
          if( that.attr('data-icon') == 'image' ){
            icon_html = '<span class="mfn-arrow-icon"><img src="'+that.attr('data-path')+'" alt=""></span>';
          }else if( that.attr('data-icon') == 'icon' ){
            icon_html = '<span class="mfn-arrow-icon"><i class="'+that.attr('data-path')+'"></i></span>';
          }

          $current.children('a').append(icon_html);
        }

      });
    }
}

 // Portfolio - Isotope

function portfolioIsotope() {

    $content.find('.blog_wrapper .isotope:not( .masonry ), .portfolio_wrapper .isotope:not( .masonry-flat, .masonry-hover, .masonry-minimal').each(function() {

    var $el = $(this);

    if( !$el.hasClass('mfn-initialized') ){
        $el.addClass('mfn-initialized');

    $el.imagesLoaded( function() {
        $el.isotope({
          itemSelector: '.isotope-item',
          layoutMode: 'fitRows',
          isOriginLeft: rtl ? false : true
        });

            $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width()-1});
            setTimeout(function () { $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width() }); },500);
        });

    }


    });

}

// inline eeditor

function inlineEditor() {

    //rangy.init();

    if( $builder.find('.vb-item.mcb-column .mfn-inline-editor:not(.mfn-initialized)').length ){

        var iframe = $('iframe#mfn-vb-ifr').get(0);

        var ToolsSwitchMore = MediumEditor.extensions.button.extend({
            name: 'switchMore',
            action: 'switchMore',
            aria: 'More options',
            contentDefault: '&#8286;',
            contentFA: '<i class="fas fa-ellipsis-h"></i>',
            hasForm: false,
            handleClick: function( event ) {
                event.preventDefault();
                event.stopPropagation();
                $("iframe#mfn-vb-ifr").contents().find('body').toggleClass('mfn-inline-editor-toolbar-more');
                return false;
            },
        });

        var ToolsMfnRemoveFormat = MediumEditor.extensions.button.extend({
            name: 'mfnRemoveFormat',
            action: 'mfnRemoveFormat',
            aria: 'Remove format',
            contentDefault: '&#8286;',
            contentFA: '<i class="fas fa-eraser"></i>',
            hasForm: false,
            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
            },

            handleClick: function( event ) {
                var nodes          = MediumEditor.selection.getSelectedElements( this.document ),
                    selectionRange = MediumEditor.selection.getSelectionRange( this.document ),
                    parentEl       = MediumEditor.selection.getSelectedParentElement( selectionRange ),
                    element = MediumEditor.selection.getSelectionElement( this.document );

                event.preventDefault();
                event.stopPropagation();

                if ( ! nodes.length && parentEl ) {
                    nodes = [ parentEl ];
                }

                nodes.forEach(function( el ) {
                    $(el).removeAttr( 'data-font-family' );
                    $(el).removeAttr( 'data-line-height' );
                    $(el).removeAttr( 'data-letter-spacing' );
                    $(el).removeAttr( 'data-font-size' );
                    $(el).removeAttr( 'data-font-weight' );
                    $(el).removeAttr( 'style' );

                    if( $(el).find('.highlight-word').length ){
                        $(el).replaceWith($(el).find('.highlight-word').text());
                    }

                    if(el.tagName.toLowerCase() == 'span'){

                        if( $(el).closest('.highlight').length ) {
                            $(el).closest('.highlight').replaceWith( $(el).text() );
                        }else{
                            $(el).replaceWith( $(el).text() );
                        }
                    }
                });

                this.execAction( 'removeFormat', { skipCheck: true } );
                this.triggerUpdate( element );

                return false;

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },
        });

        var ToolsColorPicker = MediumEditor.extensions.form.extend({
            name: 'colorPicker',
            action: 'colorPicker',
            aria: 'colorPicker',
            contentDefault: '&#9775;',
            contentFA: '<i class="fas fa-palette"></i><span></span>',
            hasForm: true,
            override: false,
            parentCid: false,

            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
                this.classApplier = rangy.createClassApplier( 'mfn-inline-txt-editing', {
                    elementTagName: 'span',
                    tagNames: [ 'span', 'b', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    normalize: true
                } );

            },

            getForm: function() {
                if ( ! this.form ) {
                    this.form = this.createForm();
                }
                this.on( this.form, 'click', this.handleFormClick.bind( this ) );
                return this.form;
            },

            checkState: function( node ) {
                var nodes = MediumEditor.selection.getSelectedElements( this.document ),
                    color = this.getExistingValue( nodes );

                if ( 'undefined' !== typeof color ) {
                    this.button.querySelector( 'span' ).style.backgroundColor = color;
                }
            },

            createForm: function() {
                var self   = this,
                    doc    = this.document,
                    form   = doc.createElement( 'div' ),
                    input  = doc.createElement( 'input' ),
                    close  = doc.createElement( 'a' );

                this.on( form, 'click', this.handleFormClick.bind( this ) );
                form.className = 'medium-editor-toolbar-form mfn-medium-editor-color-picker';
                form.id        = 'mfn-medium-editor-cp-' + this.getEditorId();

                input.className = 'medium-editor-toolbar-input mfn-medium-editor-color-picker-input';
                input.setAttribute( 'type', 'text' );
                input.setAttribute( 'data-alpha', true );
                form.appendChild( input );

                close.className = 'medium-editor-toolbar-close';
                close.innerHTML = '<i class="fas fa-check"></i>';
                form.appendChild( close );

                this.on( close, 'click', this.handleSaveClick.bind( this ), true );

                return form;
            },

            isDisplayed: function() {
                return this.getForm().classList.contains( 'mfn-visible' );
            },

            handleClick: function( event ) {
                var nodes,
                    txt;

                event.preventDefault();
                event.stopPropagation();

                if ( ! this.isDisplayed() ) {
                    nodes = MediumEditor.selection.getSelectedElements( this.document );
                    txt  = this.getExistingValue( nodes );
                    txt  = 'undefined' !== typeof txt ? txt : '';

                    this.showForm( txt );
                }

                return false;
            },

            getInput: function() {
                return this.getForm().querySelector( 'input.medium-editor-toolbar-input' );
            },

            showForm: function( fontColor ) {
                var self  = this,
                    input = this.getInput(),
                    form  = this.getForm();

                this.base.saveSelection();
                form.classList.add( 'mfn-visible' );

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').hide();
                //medium-editor-toolbar-2

                input.value = fontColor || '';

                $( input ).wpColorPicker( {
                    palettes: true,
                    mode : 'hex',
                    hide: true,
                    change: function( event, ui ) {
                        if ( 'none' !== $( input ).closest( '.mfn-medium-editor-color-picker' ).find( '.iris-picker' ).css( 'display' ) ) {
                            self.handleColorChange( ui.color.toString() );
                        }
                    },
                    clear: function( event, ui ) {
                        self.clearFontColor();
                    }
                } );

                $( input ).iris( 'color', input.value );
                $( input ).iris( 'show' );

                this.setToolbarPosition();
            },

            getExistingValue: function( nodes ) {
                var nodeIndex,
                    color,
                    el;

                if ( ! nodes.length ) {
                    nodes = this.base.elements;
                }

                for ( nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++ ) {
                    el    = nodes[ nodeIndex ];
                    color = $( el ).css( 'color' );
                }

                return color;
            },

            handleFormClick: function( event ) {
                event.stopPropagation();
            },

            handleSaveClick: function( event ) {
                event.preventDefault();
                this.hideForm();
            },

            hideForm: function() {
                var self         = this,
                    form         = this.getForm();

                $(form).removeClass( 'mfn-visible' );
                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').show();

                this.getInput().value = '';

                this.base.restoreSelection();
                self.setToolbarPosition();

            },

            clearFontColor: function() {
                this.base.restoreSelection();

                MediumEditor.selection.getSelectedElements( this.document ).forEach( function( el ) {
                    if ( 'undefined' !== typeof el.style && 'undefined' !== typeof el.style.color ) {
                        el.style.color = '';
                    }
                } );

                this.base.trigger( 'editableInput', {}, MediumEditor.selection.getSelectionElement( this.document ) );
            },

            handleColorChange: function( color ) {

                var iframeWin = rangy.dom.getIframeWindow( iframe ),
                        element,
                        self = this,
                        color = 'undefined' === color || 'undefined' === typeof color ? this.getInput().value : color;

                    this.base.restoreSelection();

                    element = MediumEditor.selection.getSelectionElement( this.document );

                    if ( ! element ) {
                        return;
                    }

                    this.classApplier.applyToSelection( iframeWin );

                    element.querySelectorAll( '.mfn-inline-txt-editing' ).forEach( function( el ) {
                        if ( el.classList.contains( 'mfn-inline-txt-editing' ) ) {
                            $( el ).css( { color: color } );
                            self.button.classList = 'medium-editor-button-active';
                            el.classList.remove( 'mfn-inline-txt-editing' );

                            if ( 0 === el.classList.length ) {
                                el.removeAttribute( 'class' );
                            }
                        }
                    } );

                    this.triggerUpdate( element );

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },
        });

        var ToolsTypography = MediumEditor.extensions.form.extend({
            name: 'typography',
            action: 'typography',
            aria: 'typography',
            contentDefault: '&#9775;',
            contentFA: '<i class="fas fa-font"></i>',
            hasForm: true,
            override: false,
            parentCid: false,

            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
                this.classApplier = rangy.createClassApplier( 'mfn-inline-txt-editing', {
                    elementTagName: 'span',
                    tagNames: [ 'span', 'b', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    normalize: true
                } );

            },

            getForm: function() {
                if ( ! this.form ) {
                    this.form = this.createForm();
                }
                this.on( this.form, 'click', this.handleFormClick.bind( this ) );
                return this.form;
            },

            checkState: function( node ) {
                var nodes = MediumEditor.selection.getSelectedElements( this.document ),
                    typo = this.getExistingValue( nodes, true );

                if ( typo ) {
                    this.button.classList = 'medium-editor-button-active';
                }
            },

            createForm: function() {
                var self   = this,
                    doc    = this.document,
                    close  = doc.createElement( 'a' ),
                    form   = doc.createElement( 'div' );

                this.on( form, 'click', this.handleFormClick.bind( this ) );
                form.className = 'medium-editor-toolbar-form mfn-medium-editor-typography';
                form.id        = 'mfn-medium-editor-typo-' + this.getEditorId();

                $('<div class="mfn-medium-editor-form-row"><label>Font size</label><input data-style="font-size" class="medium-editor-toolbar-input mfn-medium-editor-font-size-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Line height</label><input data-style="line-height" class="medium-editor-toolbar-input mfn-medium-editor-line-height-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Letter spacing</label><input data-style="letter-spacing" class="medium-editor-toolbar-input mfn-medium-editor-letter-spacing-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Font family</label><select data-style="font-family" class="medium-editor-toolbar-input mfn-medium-editor-font-family-input"><optgroup label="System"><option value="" selected>Default</option><option value="Arial">Arial</option><option value="Georgia">Georgia</option><option value="Tahoma">Tahoma</option><option value="Times">Times</option><option value="Trebuchet">Trebuchet</option><option value="Verdana">Verdana</option></optgroup></select></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Font weight</label><select data-style="font-weight" class="medium-editor-toolbar-input mfn-medium-editor-font-weight-input"><option value="" selected>Default</option><option value="normal">Normal</option><option value="bold">Bold</option><option value="100">100</option><option value="200">200</option><option value="300">300</option><option value="400">400</option><option value="500">500</option><option value="600">600</option><option value="700">700</option><option value="800">800</option><option value="900">900</option></select></div>').appendTo(form);

                close.className = 'medium-editor-toolbar-close';
                close.innerHTML = '<i class="fas fa-check"></i>';
                form.appendChild( close );

                this.on( close, 'click', this.handleSaveClick.bind( this ), true );

                return form;
            },

            isDisplayed: function() {
                return this.getForm().classList.contains( 'mfn-visible' );
            },

            handleClick: function( event ) {
                var nodes,
                    txt;

                event.preventDefault();
                event.stopPropagation();

                if ( ! this.isDisplayed() ) {
                    nodes = MediumEditor.selection.getSelectedElements( this.document );
                    txt  = this.getExistingValue( nodes );
                    txt  = 'undefined' !== typeof txt ? txt : '';

                    this.showForm( txt );

                }else{
                    this.hideForm();
                }

                return false;
            },

            getInput: function() {
                var inputs = {
                    fontsize: this.getForm().querySelector( 'input.mfn-medium-editor-font-size-input' ),
                    lineheight: this.getForm().querySelector( 'input.mfn-medium-editor-line-height-input' ),
                    letterspacing: this.getForm().querySelector( 'input.mfn-medium-editor-letter-spacing-input' ),
                    fontfamily: this.getForm().querySelector( 'select.mfn-medium-editor-font-family-input' ),
                    fontweight: this.getForm().querySelector( 'select.mfn-medium-editor-font-weight-input' ),
                };
                return inputs;
            },

            showForm: function( typo ) {
                var self  = this,
                    input = this.getInput(),
                    form  = this.getForm();

                this.base.saveSelection();
                form.classList.add( 'mfn-visible' );

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').hide();

                form.classList.remove( 'hidden' );

                // google fonts
                if( !$(input.fontfamily).find('optgroup[label="Google"]').length ){
                    var g_fonts = '';
                    mfnvbvars.mfn_google_fonts.map((value) => {
                      g_fonts += '<option value="'+value+'">'+value+'</option>';
                    });
                    $(input.fontfamily).append( $('<optgroup label="Google">'+g_fonts+'</optgroup>') );
                }

                $( input.fontsize ).val( typo.fontsize || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });
                $( input.lineheight ).val( typo.lineheight || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });
                $( input.letterspacing ).val( typo.letterspacing || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });
                $( input.fontfamily ).val( typo.fontfamily.replaceAll('"', '') || '' )
                    .on('change', function() {
                        var style_attr = $(this).attr('data-style');
                        var val = $(this).val().replace('&quot;', '');
                        var fonts_group = $(this).find(':selected').closest('optgroup').attr('label');

                        if( fonts_group == 'Google' ){
                            WebFont.load({
                                google: {
                                  families: [val]
                                },
                                context: window.frames[0].frameElement.contentWindow,
                                fontactive: function(familyName,fvd){
                                    self.handleTypoChange( style_attr, familyName );
                                    return;
                                },
                            });
                        }else{
                            self.handleTypoChange( style_attr, val, true );
                        }

                    });
                $( input.fontweight ).val( typo.fontweight || '' ).on('change', function() {
                    self.handleTypoChange( $(this).attr('data-style'), $(this).val() );
                });

                this.setToolbarPosition();

            },

            getExistingValue: function( nodes, active = false ) {
                var nodeIndex,
                    typo,
                    el;

                if ( ! nodes.length ) {
                    nodes = this.base.elements;
                }

                for ( nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++ ) {
                    el    = nodes[ nodeIndex ];

                    if( active ){
                        typo = false;
                        if (typeof $( el ).attr('data-font-size') !== 'undefined' && $( el ).attr('data-font-size') !== false) typo = true;
                        if (typeof $( el ).attr('data-line-height') !== 'undefined' && $( el ).attr('data-line-height') !== false) typo = true;
                        if (typeof $( el ).attr('data-letter-spacing') !== 'undefined' && $( el ).attr('data-letter-spacing') !== false) typo = true;
                        if (typeof $( el ).attr('data-font-family') !== 'undefined' && $( el ).attr('data-font-family') !== false) typo = true;
                        if (typeof $( el ).attr('data-font-weight') !== 'undefined' && $( el ).attr('data-font-weight') !== false) typo = true;
                        return typo;
                    }

                    typo = {
                        fontsize: $( el ).css( 'font-size' ),
                        lineheight: $( el ).css( 'line-height' ),
                        letterspacing: $( el ).css( 'letter-spacing' ),
                        fontfamily: $( el ).css( 'font-family' ),
                        fontweight: $( el ).css( 'font-weight' ),
                    };
                }

                return typo;
            },

            handleFormClick: function( event ) {
                event.stopPropagation();
            },

            handleSaveClick: function( event ) {
                event.preventDefault();
                this.hideForm();
            },

            hideForm: function() {
                var self         = this,
                    form         = this.getForm();

                $(form).removeClass( 'mfn-visible' );

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').show();

                this.base.restoreSelection();
                self.setToolbarPosition();
            },

            handleTypoChange: function( key, value, data = false ) {
                var iframeWin = rangy.dom.getIframeWindow( iframe ),
                        element,
                        self = this;

                    this.base.restoreSelection();

                    element = MediumEditor.selection.getSelectionElement( this.document );

                    if ( ! element ) {
                        return;
                    }

                    this.classApplier.applyToSelection( iframeWin );

                    element.querySelectorAll( '.mfn-inline-txt-editing' ).forEach( function( el ) {
                        if ( el.classList.contains( 'mfn-inline-txt-editing' ) ) {
                            if( value.length ){
                                $( el ).css( key, value )
                                if( !data ) {
                                    $( el ).attr('data-'+key, $( el ).css( key ));
                                }else{
                                    $( el ).removeAttr('data-'+key);
                                }
                                self.button.classList = 'medium-editor-button-active';
                            }else{
                                $( el ).removeAttr('data-'+key);
                            }

                            el.classList.remove( 'mfn-inline-txt-editing' );

                            if ( 0 === el.classList.length ) {
                                el.removeAttribute( 'class' );
                            }
                        }
                    } );

                    this.triggerUpdate( element );

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },

        });

        var ToolsHighlighter = MediumEditor.extensions.form.extend({
            name: 'mfnHghter',
            action: 'mfnHghter',
            aria: 'mfnHghter',
            contentDefault: '&#9775;',
            contentFA: '<i class="fas fa-highlighter"></i><span></span>',
            hasForm: true,
            override: false,
            parentCid: false,

            init: function() {
                MediumEditor.extensions.form.prototype.init.apply( this, arguments );
                this.classApplier = rangy.createClassApplier( 'mfn-inline-txt-editing', {
                    elementTagName: 'span',
                    tagNames: [ 'span', 'b', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
                    normalize: true
                } );

            },

            getForm: function() {
                if ( ! this.form ) {
                    this.form = this.createForm();
                }
                this.on( this.form, 'click', this.handleFormClick.bind( this ) );
                return this.form;
            },

            checkState: function( node ) {
                var nodes = MediumEditor.selection.getSelectedElements( this.document ),
                    mfnhighlighter = this.getExistingValue( nodes, true );

                if ( mfnhighlighter.check ) {
                    this.button.classList = 'medium-editor-button-active';
                }
            },

            createForm: function() {
                var self   = this,
                    doc    = this.document,
                    close  = doc.createElement( 'a' ),
                    form   = doc.createElement( 'div' );

                this.on( form, 'click', this.handleFormClick.bind( this ) );
                form.className = 'medium-editor-toolbar-form mfn-medium-editor-mfnhighlighter';
                form.id        = 'mfn-medium-editor-mfnhighlighter-' + this.getEditorId();

                $('<div class="mfn-medium-editor-form-row"><label>Color</label><input type="text" data-alpha="true" class="medium-editor-toolbar-input mfn-medium-editor-mfnhighlighter-color-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Background</label><input type="text" data-alpha="true" class="medium-editor-toolbar-input mfn-medium-editor-mfnhighlighter-background-input" /></div>').appendTo(form);
                $('<div class="mfn-medium-editor-form-row"><label>Style</label><select class="medium-editor-toolbar-input mfn-medium-editor-mfnhighlighter-style-input"><option value="" selected>Default</option><option value="underline">Underline</option></select></div>').appendTo(form);

                close.className = 'medium-editor-toolbar-close';
                close.innerHTML = '<i class="fas fa-check"></i>';
                form.appendChild( close );

                this.on( close, 'click', this.handleSaveClick.bind( this ), true );

                return form;
            },

            isDisplayed: function() {
                return this.getForm().classList.contains( 'mfn-visible' );
            },

            handleClick: function( event ) {
                var nodes,
                    txt;

                event.preventDefault();
                event.stopPropagation();

                if ( ! this.isDisplayed() ) {
                    nodes = MediumEditor.selection.getSelectedElements( this.document );
                    txt  = this.getExistingValue( nodes );
                    txt  = 'undefined' !== typeof txt ? txt : '';

                    this.showForm( txt );
                }else{
                    this.hideForm();
                }

                return false;
            },

            getInput: function() {
                var inputs = {
                    color: this.getForm().querySelector( 'input.mfn-medium-editor-mfnhighlighter-color-input' ),
                    background: this.getForm().querySelector( 'input.mfn-medium-editor-mfnhighlighter-background-input' ),
                    style: this.getForm().querySelector( 'select.mfn-medium-editor-mfnhighlighter-style-input' ),
                };
                return inputs;
            },

            showForm: function( mfnhighlighter ) {
                var self  = this,
                    input = this.getInput(),
                    form  = this.getForm();

                this.base.saveSelection();

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').hide();
                form.classList.add( 'mfn-visible' );

                var color_val = mfnhighlighter.check ? mfnhighlighter.color : '';
                var bg_val = mfnhighlighter.check ? mfnhighlighter.background : '';
                var style_val = mfnhighlighter.check ? mfnhighlighter.style : '';

                $( input.color ).wpColorPicker( {
                    palettes: false,
                    mode : 'hsl',
                    change: function( event, ui ) {
                        self.handleHighlighterChange( ui.color.toString(), input.background.value, input.style.value );
                    },
                } );

                $( input.background ).wpColorPicker( {
                    palettes: false,
                    mode : 'hsl',
                    change: function( event, ui ) {
                        self.handleHighlighterChange( input.color.value, ui.color.toString(), input.style.value );
                    },
                } );

                this.setToolbarPosition();

                $( input.color ).iris( 'color', color_val );
                $( input.background ).iris( 'color', bg_val );

                $( input.color ).iris( 'hide' );
                $( input.background ).iris( 'hide' );

                $( input.color ).on('click', function() {
                    $( input.background ).iris( 'hide' );
                    $( input.color ).iris( 'show' );
                    return false;
                });

                $( input.background ).on('click', function() {
                    $( input.color ).iris( 'hide' );
                    $( input.background ).iris( 'show' );
                    return false;
                });

                $( input.style ).val(style_val).on('change', function() {
                    self.handleHighlighterChange( input.color.value, input.background.value, $(this).val() );
                });

            },

            getExistingValue: function( nodes, active = false ) {
                var nodeIndex,
                    mfnhighlighter,
                    el, check;

                if ( ! nodes.length ) {
                    nodes = this.base.elements;
                }

                check = false;

                for ( nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++ ) {
                    el    = nodes[ nodeIndex ];

                    mfnhighlighter = {
                        check:      $( el ).hasClass('highlight') || $( el ).parent().hasClass('highlight') || $( el ).children().hasClass('highlight') ? true : false,
                        color:      $( el ).css( 'color' ),
                        background: $( el ).css( 'background-color' ),
                        style:      $( el ).hasClass('highlight-underline') ? 'highlight-underline' : ''
                    };

                }

                return mfnhighlighter;
            },

            handleFormClick: function( event ) {
                event.stopPropagation();
            },

            handleSaveClick: function( event ) {
                event.preventDefault();
                this.hideForm();
            },

            hideForm: function() {
                var self         = this,
                    form         = this.getForm();

                $content.find('#medium-editor-toolbar-'+this.getEditorId()+' .medium-editor-toolbar-actions').show();
                form.classList.remove( 'mfn-visible' );

                //this.base.restoreSelection();
                this.setToolbarPosition();
            },

            handleHighlighterChange: function( color, bg, style ) {
                var iframeWin = rangy.dom.getIframeWindow( iframe ),
                        self = this,
                        element;

                    this.base.restoreSelection();

                    element = MediumEditor.selection.getSelectionElement( this.document );

                    if ( ! element ) {
                        return;
                    }

                    this.classApplier.applyToSelection( iframeWin );

                    var txt_content = false;


                    element.querySelectorAll( '.mfn-inline-txt-editing' ).forEach( function( el ) {
                        if ( el.classList.contains( 'mfn-inline-txt-editing' ) ) {

                            if( !txt_content ){
                                // get clear txt
                                if( $(el).find('.highlight-word').length ){
                                    txt_content = $(el).find('.highlight-word').text();
                                }else{
                                    txt_content = $(el).text();
                                }

                                var $wrapper;

                                if( $(el).closest('.highlight').length ){
                                    $wrapper = $(el).closest('.highlight');
                                }else{
                                    $wrapper = $(el);
                                }

                                $wrapper.empty();
                                $wrapper.text(txt_content).removeClass('highlight highlight-underline');

                                if( style != '' ){
                                    $wrapper.addClass('highlight highlight-underline').css('color', color).css('background-color', bg).html('<span class="highlight-word">'+txt_content+'<span class="highlight-border" style="background-color:'+bg+'; color:'+color+';"></span></span>');
                                }else{
                                    $wrapper.addClass('highlight').css('color', color).css('background-color', bg).text(txt_content);
                                }

                                self.button.classList = 'medium-editor-button-active';
                            }

                            el.classList.remove( 'mfn-inline-txt-editing' );

                            if ( 0 === el.classList.length ) {
                                el.removeAttribute( 'class' );
                            }
                        }
                    } );

                    this.triggerUpdate( element );

            },

            triggerUpdate: function( element ) {
                this.base.trigger( 'editableInput', {}, element );
            },

        });

        $builder.find('.vb-item.mcb-column .mfn-inline-editor:not(.mfn-initialized)').each(function(i) {
            $iframeCont = $(this);

            $iframeCont.addClass('mfn-initialized').attr('data-mfnindex', inlineIndex);

            inlineEditors[inlineIndex] = new MediumEditor( $(this).get(0), {
                buttonLabels: 'fontawesome',
                contentWindow: iframe.contentWindow,
                ownerDocument: iframe.contentWindow.document,
                elementsContainer: iframe.contentWindow.document.body,
                anchorPreview: false,
                previewValueSelector: 'a',
                anchor: {
                    customClassOption: null,
                    customClassOptionText: 'Button',
                    linkValidation: false,
                    placeholderText: 'Paste or type a link',
                    targetCheckbox: true,
                    targetCheckboxText: 'Open in new window'
                },
                extensions: {
                    switchMore: new ToolsSwitchMore(),
                    colorPicker: new ToolsColorPicker(),
                    //mfnHghter: new ToolsHighlighter(),
                    typography: new ToolsTypography(),
                    mfnRemoveFormat: new ToolsMfnRemoveFormat(),
                },
                toolbar: {
                    buttons: ['typography', 'bold', 'italic', 'underline', 'strikethrough', 'colorPicker', 'anchor', 'quote', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'orderedlist', 'unorderedlist', 'indent', 'outdent', 'mfnRemoveFormat',  'switchMore'],
                },
                paste: {
                    forcePlainText: false,
                    cleanPastedHTML: false
                }
            });

            inlineIndex++;
        })
    }
}


// Blog & Portfolio - Masonry

function blogPortfolioMasonry() {

    $content.find('.isotope.masonry, .isotope.masonry-hover, .isotope.masonry-minimal').each(function() {

    var $el = $(this);

    if( !$el.hasClass('mfn-initialized') ){
        $el.addClass('mfn-initialized');
    $el.imagesLoaded( function() {

    $el.isotope({
      itemSelector: '.isotope-item',
      layoutMode: 'masonry',
      isOriginLeft: rtl ? false : true
    });

            $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width()-1});
            setTimeout(function () { $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width() }); },500);
        });

}

});

}

// Append spans to additional info table

function spanToAdditionalInfo(){
    $content.find('.woocommerce-product-attributes td, .woocommerce-product-attributes th').each(function() {
      $(this).html('<span>'+$(this).html()+'</span>');
    });
}



// gallery

/*function mfnGalleryInit(){

    $content.find('.column_image_gallery').each(function() {

    var $el = $(this);

    var $grid = $el.find('.gallery');

    if(!$grid.hasClass('mfn-initialized')){

    var id = $grid.attr('id');

      $('> br', $grid).remove();

      $('.gallery-icon > a', $grid)
        .wrap('<div class="image_frame scale-with-grid"><div class="image_wrapper"></div></div>')
        .prepend('<div class="mask"></div>')
        .children('img');

      // lightbox | link to media file

      if ($grid.hasClass('file')) {
        $('.gallery-icon a', $grid)
          .attr('rel', 'prettyphoto[' + id + ']')
          .attr('data-elementor-lightbox-slideshow', id); // FIX: elementor lightbox gallery
      }

      // isotope for masonry layout

      if ($grid.hasClass('masonry')) {

        $grid.imagesLoaded( function() {
            $grid.isotope({
              itemSelector: '.gallery-item',
              layoutMode: 'masonry',
              isOriginLeft: rtl ? false : true
            });
            $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width()-1});
            setTimeout(function () { $('.preview-wrapper').css({'margin-left': $('.sidebar-wrapper').width() }); },500);
        });



        $grid.addClass('mfn-initialized');

        iframe.jQuery('window').trigger('resize');
      }


    }

});
}*/


var scrollTicker, lightboxAttr, sidebar,
    rtl = $('body').hasClass('rtl'),
    simple = $('body').hasClass('style-simple'),
    topBarTop = '61px',
    headerH = 0,
    mobileInitW = (mfn.mobileInit) ? mfn.mobileInit : 1240;

    // Slick Slider | Auto responsive

    function slickAutoResponsive(slider, max, size, round = false) {

      if (!max){
        max = 5;
      }
      if (!size){
        size = 380;
      }

      var width = slider.width() || 0;
      var count;

      if ( round ) {
        count = Math.floor(width / size);
      } else {
        count = Math.ceil(width / size);
      }

      if (count < 1) count = 1;
      if (count > max) count = max;

      return count;
    }

// Slider | Blog

  function mfnSliderBlog() {

    var pager = function(el, i) {
      return '<a>' + i + '</a>';
    };

    $content.find('.blog_slider .blog_slider_ul:not(.slick-initialized)').each(function() {

    var slider = $(this);
    var slidesToShow = 4;

    var count = slider.closest('.blog_slider').attr('count');
    var singlePostMode = slider.closest('.blog_slider').hasClass('single_post_mode');

    if (slidesToShow > count) {
      slidesToShow = count;
      if (slidesToShow < 1) {
        slidesToShow = 1;
      }
    }

    if (singlePostMode) {
      slidesToShow = 1;
    }

    slider.slick({
      cssEase: 'ease-out',
      dots: true,
      infinite: true,
      touchThreshold: 10,
      speed: 300,

      prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
      nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
      appendArrows: slider.siblings('.blog_slider_header').children('.slider_navigation'),

      appendDots: slider.siblings('.slider_pager'),
      customPaging: pager,

      rtl: rtl ? true : false,
      autoplay: mfn.slider.blog ? true : false,
      autoplaySpeed: mfn.slider.blog ? mfn.slider.blog : 5000,

      slidesToShow: slickAutoResponsive(slider, slidesToShow),
      slidesToScroll: slickAutoResponsive(slider, slidesToShow)
    });


  });


}

  // Slider | Clients

function mfnSliderClients() {
$content.find('.clients_slider_ul').each(function() {

  var slider = $(this);

  var clientsPerSlide = slider.closest('.clients_slider').attr('data-client-per-slide') ? parseInt(slider.closest('.clients_slider').attr('data-client-per-slide')) : 4;

  var navigationPosition = slider.closest('.clients_slider').attr('data-navigation-position') || false;
    var appendArrows = ( navigationPosition == 'content' ) ? slider : slider.siblings('.blog_slider_header').children('.slider_navigation');

  var size = 400;

  var calc = () => slickAutoResponsive(slider, clientsPerSlide, size - (clientsPerSlide * 40), true);

  slider.not('.slick-initialized').slick({
    cssEase: 'ease-out',
    dots: false,
    infinite: true,
    touchThreshold: 10,
    speed: 300,

    prevArrow: '<a class="button the-icon slider_prev" href="#"><span class="button_icon"><i class="icon-left-open-big"></i></span></a>',
    nextArrow: '<a class="button the-icon slider_next" href="#"><span class="button_icon"><i class="icon-right-open-big"></i></span></a>',
    appendArrows: appendArrows,

    rtl: rtl ? true : false,
    autoplay: mfn.slider.clients ? true : false,
    autoplaySpeed: mfn.slider.clients ? mfn.slider.clients : 5000,

    slidesToShow: calc(),
    slidesToScroll: calc()
  });

  // ON | debouncedresize

  $(window).on('debouncedresize', function() {
    slider.slick('slickSetOption', 'slidesToShow', calc(), false);
    slider.slick('slickSetOption', 'slidesToScroll', calc(), true);
  });

});
}


var templatesPostType = {

    count: $('.mfn-df-row').not('.clone').length > 0 ? $('.mfn-df-row').not('.clone').length : 0,

    beforeUpdate: function() {
        $('.woo-display-conditions').on('click', function(e) {
          e.preventDefault();
          // resetSaveButton();
          $('.modal-display-conditions').addClass('show');
        });

        $('.df-add-row').on('click', function(e) {
          e.preventDefault();
          var $cloned = builder_type == 'single-product' || builder_type == 'shop-archive' ? $('.mfn-df-row.clone.df-type-woo').clone() : $('.mfn-df-row.clone.df-type-tmpl-part').clone();
          $cloned.find('.df-input').each(function() {
            $(this).attr('name', $(this).attr('data-name').replace("mfn_template_conditions[0]", "mfn_template_conditions["+templatesPostType.count+"]"));
            $(this).removeAttr('data-name');
          })
          $cloned.removeClass('clone').appendTo( $('.mfn-dynamic-form') );
          templatesPostType.count++;
        });

        $('.modal-display-conditions').on('click', '.df-remove', function(e) {
          e.preventDefault();
          $(this).closest('.mfn-df-row').remove();
        });

        $('.modal-display-conditions').on('change', '.df-input-rule', function() {
          if( $(this).val() == 'exclude' ){
            $(this).addClass('minus');
          }else{
            $(this).removeClass('minus');
          }
        });

        $('.modal-display-conditions').on('change', '.df-input-var', function() {
          $(this).siblings('.df-input-opt').removeClass('show');
          if( $(this).val() != 'shop' && $(this).siblings('.df-input-'+$(this).val()).length ){
            $(this).siblings('.df-input-'+$(this).val()).addClass('show');
          }
        });

        templatesPostType.closeModal();
    },

    closeModal: function() {
        // close
        $('.modal-display-conditions .btn-modal-close').on('click', function(e) {
          e.preventDefault();
          $('.modal-display-conditions').removeClass('show');
        });
    }

};


if($('.modal-display-conditions').length){
    templatesPostType.beforeUpdate();
}

/**
 *
 * NEW ACM start
 *
 * */

$editpanel.on('click', '.panel-edit-item .row-header.toggled_header', function(e){
    e.preventDefault();
    var $header = $(this);

    if( !$header.hasClass('mfn-toggle-expanded') ){
        $('.mfn-ui .mfn-form .modalbox-card.active .row-header.toggled_header.mfn-toggle-expanded').removeClass('mfn-toggle-expanded');
        $(".mfn-ui .mfn-form .modalbox-card.active > .mfn-vb-formrow").not('.toggled_header').addClass('mfn-toggled');

        $header.addClass('mfn-toggle-expanded');
        $header.nextUntil(".toggled_header").removeClass('mfn-toggled');

    }else{
        $('.mfn-ui .mfn-form .modalbox-card.active .row-header.toggled_header.mfn-toggle-expanded').removeClass('mfn-toggle-expanded');
        $(".mfn-ui .mfn-form .modalbox-card.active > .mfn-vb-formrow").not('.toggled_header').addClass('mfn-toggled');
    }

});

$editpanel.on('click', '.mfn-form-row.toggle_fields > label > .mfn-vb-label-button', function(e) {
    e.preventDefault();

    var $box = $(this).closest('.mfn-form-row');

    initFontSelect($box);

    $box.toggleClass('mfn-fields-active');
    $('.sidebar-wrapper').toggleClass('mfn-vb-sidebar-overlay');
    $(document).bind('click', hideLabelButtonInputs);
});

function initFontSelect($box){

    let options = '';
    if( $box.find('.form-group.font-family-select select').length ){
        $box.find('.form-group.font-family-select select').each(function() {
            var $select = $(this);

            if( typeof mfnvbvars.mfn_google_fonts !== 'undefined' ){
              mfnvbvars.mfn_google_fonts.forEach((entry) => {
                options += '<option value="'+ entry +'">'+ entry +'</option>';
              });
              if( $select.find('optgroup[data-type="google-fonts"] option').length == 1 ){
                $select.find('optgroup[data-type="google-fonts"]').html(options);
              }
            }

            let value = $select.attr('data-value');
            if( typeof value !== 'undefined' ){
                if( $select.find('option[value="'+value+'"]').length ){
                    $select.val(value);
                }else if($select.find('option[value="#'+value+'"]').length){
                    $select.val('#'+value);
                }

            }
        });
    }
}

function initSocialSorting($box) {
    if( $box.find('.social-link .social-wrapper:not(.mfn-initialized)').length ){

        let $wrapper = $box.find('.social-link .social-wrapper:not(.mfn-initialized)');
        let $input = $box.find('input.social-order');

        $wrapper.sortable({
            axis: "y",
            handle: ".drag",
            stop: function(event, elem) {
                var arr = [];
                $wrapper.find('li').each(function() {
                    arr.push( $(this).attr('data-key') );
                });
                $input.val(arr.join(',')).trigger('change');
            }
        });
        $wrapper.addClass('mfn-initialized');
    }
}

// Reset CSS Filters to default
$editpanel.on('click', '.mfn-form-row.toggle_fields > label > a.reset-css-filters', function(e) {
  e.preventDefault();

  //if( typeof edited_item.attr['style:.mcb-section-mfnuidelement .mcb-background-overlay:filter'] === 'undefined' ) return;

  var $editrow = $(this).closest('.mfn-vb-formrow');

  $editrow.find('.mfn-sliderbar-value, .field-to-object').each(function() {
    $(this).val('').trigger('change');
  });

  $editrow.find('.sliderbar .ui-slider-handle').each(function() {
    $(this).attr('style', '');
  });

  setTimeout(function() {
    if(edited_item.jsclass == 'section') {
      delete(edited_item.attr['style:.mcb-section-mfnuidelement .mcb-background-overlay:filter']);
    } else {
      delete(edited_item.attr['style:.mcb-section .mcb-wrap-mfnuidelement .mcb-wrap-inner .mcb-wrap-background-overlay:filter']);
    }
  }, 100);
});

function hideLabelButtonInputs(e){
    var div = $('.mfn-form-row.mfn-fields-active .mfn-toggle-fields-wrapper');

    if (!div.is(e.target) && div.has(e.target).length === 0){
        $('.mfn-form-row.mfn-fields-active').removeClass('mfn-fields-active');
        $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');

        $(document).unbind('click', hideLabelButtonInputs);
    }
}

$editpanel.on('click', '.mfn-form-row.mfn-sidebar-fields-tabs > ul.mfn-sft-nav li a', function(e) {
    e.preventDefault();
    var tab = $(this).attr('data-tab');
    var $box = $(this).closest('.mfn-form-row');
    $box.find('ul.mfn-sft-nav li').removeClass('active');
    $box.find('.mfn-sft').removeClass('mfn-tabs-fields-active');
    $box.find('.mfn-sft .mfn-vb-formrow').addClass('mfn-toggled');

    $box.find('.mfn-sft-'+tab).addClass('mfn-tabs-fields-active');
    $box.find('.mfn-sft-'+tab+' .mfn-vb-formrow').removeClass('mfn-toggled');

    if( !$box.find('.mfn-sft-'+tab+' .mfn-vb-formrow.mfn-fields-switcher .segmented-options li.active').length ){
        $box.find('.mfn-sft-'+tab+' .mfn-vb-formrow.mfn-fields-switcher .segmented-options li:first-child a').trigger('click');
    }

    $(this).parent().addClass('active');
});

$editpanel.on('click', '.panel-edit-item ul.sidebar-panel-content-tabs > li', function(e) {
    e.preventDefault();

    var tab = $(this).attr('data-tab');

    if( !$(this).hasClass('active') ){
        $('.panel-edit-item .modalbox-card').removeClass('active');

        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        $('.panel-edit-item .modalbox-card-'+tab).addClass('active');

        if( $(this).hasClass('spct-li-style') || $(this).hasClass('spct-li-advanced') ){
            if( !$('.mfn-element-fields-wrapper .modalbox-card.active .toggled_header').first().hasClass('mfn-toggle-expanded') ){
                $('.mfn-element-fields-wrapper .modalbox-card.active .toggled_header').first().trigger('click');
            }
        }
    }

    return;

});

/* CSS */

$('.body_offset_header .mfn-form-control').on('change', function() {
    var val = $(this).val();
    if(val == 'active'){
        var header_height = $builder.outerHeight()+'px';
        $('.body-offset-header-value .mfn-form-control').val(header_height);
    }
});

$editpanel.on('change', '.inline-style-input .mfn-field-value, .inline-style-input input[type="checkbox"]', function() {
    var $field = $(this);
    var it = $(this).closest('.mfn-element-fields-wrapper').attr('data-element');
    var val = $field.val();
    var units_check = false;
    var fonts = [];

    if( $field.val().length && $field.hasClass('has-default-unit') ){
        $.each( units, function( i, el ) {
            if( val == 'initial' || val == 'auto' || val.includes(el) ){
                units_check = true;
            }
        });

        if(units_check == false){
            $field.val(val+$field.attr('data-unit'));
        }
    }

    if( $field.closest('.typography.font-family').length && $field.val().length ){
        fonts.push($(this).val());
    }

    // web font load
    if( fonts.length ){
        WebFont.load({
            google: {
              families: fonts
            },
            context: window.frames[0].frameElement.contentWindow,
        });
    }

    if( $field.hasClass('preview-background-sizeinput') && val == 'cover-ultrawide' ){
        $content.find('.'+it).addClass('bg-cover-ultrawide');
    }else if($field.hasClass('preview-background-sizeinput') && val != 'cover-ultrawide'){
        $content.find('.'+it).removeClass('bg-cover-ultrawide');
    }

    setTimeout(function() { grabFieldStyle( $field ); }, 20);
});

function grabArrStyle(sel, val, uid){
    let rwd = 'desktop';
    let sel_ex = sel.split(':');

    if(sel.includes('_tablet')){
        rwd = 'tablet';
    }else if(sel.includes('_mobile')){
        rwd = 'mobile';
    }

    let csspath = sel_ex[1];
    let cssstyle = sel_ex[2];

    if( typeof val === 'object' ){
        var filter = '';
        $.each(val, function(k, v) {
            
            if( cssstyle.includes('typography') ){

                if(k.includes('_tablet')){
                    rwd = 'tablet';
                }else if(k.includes('_mobile')){
                    rwd = 'mobile';
                }else{
                    rwd = 'desktop';
                }

                addLocalStyle(csspath, v, k, rwd, uid);
            }else if( cssstyle.includes('filter') && v.length ){
                if( k == 'string' ) filter = v;
            }else if( cssstyle.includes('gradient') ){
                if( k == 'string' && v.length ){
                    addLocalStyle(csspath, v, 'background-image', rwd, uid);
                }else if( k == 'string' && !v.length ){
                    addLocalStyle(csspath, '', 'background-image', rwd, uid);
                    delete(edited_item[sel]);
                }
            }else if( cssstyle === 'transform'){
                addLocalStyle(csspath, `matrix(${val.scaleX}, ${val.skewY}, ${val.skewX}, ${val.scaleY}, ${val.translateX}, ${val.translateY}) rotate(${val.rotate}deg)`, 'transform', rwd, uid);
            }else{
                addLocalStyle(csspath, v, cssstyle+'-'+k, rwd, uid);
            }

        });

        if( filter.length ) {
            addLocalStyle(csspath, filter, 'filter', 'desktop', uid);
        }
        return;
    }

    /*if($box.find('.separated-fields').length){
        cssstyle = cssstyle+'-'+$field.attr('data-key');
    }*/

    if( (cssstyle == 'flex' || cssstyle == 'flex_tablet' || cssstyle == 'flex_mobile' || cssstyle == 'flex_laptop') && val.length ){
        addLocalStyle(csspath, val, 'max-width', rwd, uid);
        val = '0 0 '+val;
    }

    if( val == '' && (cssstyle == 'flex' || cssstyle == 'flex_tablet' || cssstyle == 'flex_mobile' || cssstyle == 'flex_laptop') ){
        addLocalStyle(csspath, 'unset', 'max-width', rwd, uid);
    }

    if( cssstyle == 'transformtranslatex' ){
        addLocalStyle(csspath, 'translateX('+val+')', 'transform', rwd, uid);
        return;
    }

    if( cssstyle == 'transformtranslatey' ){
        addLocalStyle(csspath, 'translateY('+val+')', 'transform', rwd, uid);
        return;
    }

    if( (cssstyle == 'background-image' || cssstyle == 'background-image_tablet' || cssstyle == 'background-image_mobile' || cssstyle == '-webkit-mask-image') && val.length ){

        if( val == '{featured_image}' ){
            val = 'var(--mfn-featured-image)';
        }else{
            val = 'url('+val+')';
        }

    }

    if( (cssstyle == 'background-size' || cssstyle == 'background-size_tablet' || cssstyle == 'background-size_mobile') && val.length && val == 'custom' ) return;
    if( (cssstyle == 'background-position' || cssstyle == 'background-position_tablet' || cssstyle == 'background-position_mobile') && val.length && val == 'custom' ) return;

    addLocalStyle(csspath, val, cssstyle, rwd, uid);
}

function grabFieldStyle($field){
    let rwd = 'desktop';
    let $box = $field.closest('.mfn-vb-formrow');
    let val = $field.val();
    let it =  $box.closest('.mfn-element-fields-wrapper').attr('data-element');
    let uid = $content.find('.'+it).attr('data-uid');

    if( $box.hasClass('transform') ){
        return;
    }

    if($box.hasClass('mfn_field_tablet')){
        rwd = 'tablet';
    }else if($box.hasClass('mfn_field_mobile')){
        rwd = 'mobile';
    }

    let csspath = $box.attr('data-csspath');
    let cssstyle = $box.attr('data-name');

    if($box.find('input.pseudo-field').length && !$field.hasClass('pseudo-field')){
        return;
    }

    if($box.find('input.pseudo-field').length){
        val = $box.find('input.pseudo-field').val();
    }

    if($box.find('.separated-fields').length){
        cssstyle = cssstyle+'-'+$field.attr('data-key');
    }

    if( $field.hasClass('preview-background-sizeinput') && val == 'cover-ultrawide' ){
        val = '';
    }

    if( (cssstyle == 'flex' || cssstyle == 'flex_tablet' || cssstyle == 'flex_laptop' || cssstyle == 'flex_mobile') && val.length ){
        addLocalStyle(csspath, val, 'max-width', rwd, uid);
        val = '0 0 '+val;
    }

    if(val == '' && (cssstyle == 'flex' || cssstyle == 'flex_tablet' || cssstyle == 'flex_laptop' || cssstyle == 'flex_mobile') ){
        addLocalStyle(csspath, 'unset', 'max-width', rwd, uid);
    }

    if( cssstyle == 'font-family' && val.includes('#') ){
        val = val.replace('#', '');
    }

    if( (cssstyle == 'background-image' || cssstyle == 'background-image_tablet' || cssstyle == 'background-image_mobile' || cssstyle == '-webkit-mask-image' ) && val.length && !$box.hasClass('gradient') ){

        if( val == '{featured_image}' && ($box.hasClass('section background-image') || $box.hasClass('wrap background-image')) ){
            //val = 'url('+mfnvbvars.themepath+'/muffin-options/svg/placeholders/featured-image.png'+')';
            val = 'var(--mfn-featured-image)';
        }else{
            val = 'url('+val+')';
        }

        //val = 'url('+val+')';

    }

    if( (cssstyle == 'background-size' || cssstyle == 'background-size_tablet' || cssstyle == 'background-size_mobile') && val.length && val == 'custom' ) return;
    if( (cssstyle == 'background-position' || cssstyle == 'background-position_tablet' || cssstyle == 'background-position_mobile') && val.length && val == 'custom' ) return;

    if( cssstyle == 'transformtranslatex' ){
        addLocalStyle(csspath, 'translateX('+val+')', 'transform', rwd, uid);
    }

    if( cssstyle == 'transformtranslatey' ){
        addLocalStyle(csspath, 'translateY('+val+')', 'transform', rwd, uid);
    }

    addLocalStyle(csspath, val, cssstyle, rwd, uid);

}

// set size labels

function setSizeLabels(){
    $content.find('.mfn-size-label .mfn-element-size-label').each(function() {
        let uid = $(this).closest('.vb-item').attr('data-uid');

        let curr_object = mfnvbvars.pagedata.filter( (item) => item.uid == uid )[0];

        /*let curr_size = $(this).closest('.vb-item').attr('data-'+screen+'-size');
        let custom_size = $('.mfn-ui .mfn-form-row.mfn-vb-'+uid+' .mfn_field_'+screen+'.advanced_flex .mfn-field-value').val();*/

        if( typeof curr_object !== 'undefined' && typeof curr_object['attr'] !== 'undefined' ) {
            if( typeof curr_object['attr']['width_switcher'] !== 'undefined' && curr_object['attr']['width_switcher'] == 'custom' ){
                $(this).text('Custom');
            }else{
                let curr_size = $(this).closest('.vb-item').attr('data-'+screen+'-size');
                $(this).text(curr_size);
            }
        }

        setTimeout(function() {
            resetBeforeAfter();
        }, 1100);

    });
}

// woocomemrce product gallery

var productgallery = {
    start: function( $container ) {

        $container.imagesLoaded( function() {

            if(!$container.find('.flex-viewport').length){
                iframe.window.jQuery('.woocommerce-product-gallery:not(.mfn-initialized)').wc_product_gallery();
                $container.addClass('mfn-initialized');
            }

            if($container.find('.flex-viewport').length){
                $loup = $container.find('.woocommerce-product-gallery__trigger').clone(true).empty().appendTo('.flex-viewport');
                $container.find('.woocommerce-product-gallery__trigger').remove();

                if($container.find('.mfn-wish-button').length){
                    $container.find('.mfn-wish-button').clone(true).appendTo('.flex-viewport');
                    $container.find('.mfn-wish-button').remove();
                }
            }else if( $container.find('.woocommerce-product-gallery__trigger').length ){
                $container.find('.woocommerce-product-gallery__trigger').empty();
            }

            if($container.find('.flex-control-thumbs').length){
                $container.find('.flex-control-thumbs').wrap('<div class="mfn-flex-control-thumbs-wrapper"></div>');
            }

            $container.imagesLoaded( function() {
                if( $container.hasClass('.mfn-thumbnails-left') || $container.hasClass('.mfn-thumbnails-right') ){
                    setTimeout(function() { productgallery.verticalThumbs($container); }, 300);
                }else if( $container.hasClass('.mfn-thumbnails-bottom') ){
                    productgallery.horizontalThumbs($container);
                }
            });

            iframe.window.jQuery('body').trigger('resize');

        });



    },
    horizontalThumbs: function($container) {
        //var $container = $container.find('.mfn-product-gallery');
        var containerW = $container.outerWidth();
        var $scroller = $container.find('.flex-control-thumbs');
        var scrollerW = 0;

        $scroller.find('li').each(function() {
          $(this).addClass('swiper-slide');
          scrollerW += $(this).outerWidth();
        });

        if( !$container.length || !$scroller.length ){
          return;
        }

        if( scrollerW > containerW ){
          //return;
          $scroller.css({ 'justify-content': 'flex-start', 'width': '100%' });
          $container.find('.mfn-flex-control-thumbs-wrapper').addClass('mfn-scroller-active');
        }

        $scroller.addClass('swiper-wrapper');

        /*var swiper = new Swiper(".mfn-flex-control-thumbs-wrapper", {
            slidesPerView: 5,
            spaceBetween: parseInt(mfnwoovars.productthumbs),
        });*/
    },
    verticalThumbs: function($container) {
        //var $container = $container.find('.mfn-product-gallery)');
        var containerH = $container.find('.woocommerce-product-gallery__image').first().outerHeight();
        var $scroller = $container.find('.flex-control-thumbs');
        var scrollerH = 0;
        var mimgm = 0; // main image margin
        var overlay = mfnwoovars.productthumbsover ? mfnwoovars.productthumbsover : 0;

        $scroller.find('li img').css({ 'height': 'auto' });
        $scroller.find('li').css({ 'height': 'auto' });

        $scroller.find('li').each(function() {
          $(this).addClass('swiper-slide').css({ 'margin-bottom': parseInt(mfnwoovars.productthumbs) });
          scrollerH += $(this).outerHeight()+parseInt(mfnwoovars.productthumbs);
          $(this).css({ 'opacity': '1' });
        });

        if(mfnwoovars.mainimgmargin == 'mfn-mim-2'){
          mimgm = 4;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-5'){
          mimgm = 10;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-10'){
          mimgm = 20;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-15'){
          mimgm = 30;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-20'){
          mimgm = 40;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-25'){
          mimgm = 50;
        }else if(mfnwoovars.mainimgmargin == 'mfn-mim-30'){
          mimgm = 60;
        }

        if( !$container.length || !$scroller.length ){
          return;
        }

        $container.find('.flex-viewport').css({'height': 'auto'});

        if( scrollerH > containerH ){
          if(overlay == 'mfn-thumbnails-overlay'){
            $container.find('.mfn-flex-control-thumbs-wrapper').height( (containerH-mimgm) );
          }else{
            $container.find('.mfn-flex-control-thumbs-wrapper').height(containerH);
          }

          $scroller.css({ 'align-items': 'flex-start' });
          $container.find('.mfn-flex-control-thumbs-wrapper').addClass('mfn-scroller-active');


          $scroller.addClass('swiper-wrapper');

          /*var swiper = new Swiper(".mfn-flex-control-thumbs-wrapper", {
            slidesPerView: 4,
            spaceBetween: parseInt(mfnwoovars.productthumbs),
            direction: "vertical",
            mousewheel: true,
          });*/

          $scroller.find('li').each(function() {
            $(this).find('img').css({ 'height': $(this).outerHeight() });
            $(this).css({ 'opacity': '1' });
          });

        }
    }
  };

/**
 * Conditions
 * mfnoptsinputs()
 */

var mfnoptsinputs = {

  start: function() {

    var prepareValues = false;

    $items = $('.mfn-ui .mfn-form .activeif:not(.mfn-initialized)');
    if( $items.length ){
        $items.each(function() {
            var fieldid = $(this).attr('data-conditionid');
            if( !$('.mfn-ui .mfn-form #'+fieldid+'.watchChanges').length ){
                $(this).addClass('conditionally-hide');
                $('.mfn-ui .mfn-form  #'+fieldid).addClass('watchChanges');
                prepareValues = true;
            }
            $(this).addClass('mfn-initialized');
        });
    }

    if( prepareValues ){
      mfnoptsinputs.startValues();
    }
  },

  startValues: function() {
    $('.mfn-ui .mfn-form .watchChanges').each(function() {
        var id = $(this).attr('id');
        var val;
        var visibility = $(this).hasClass('conditionally-hide') ? false : true;

        if( $(this).find('.single-segmented-option.segmented-options').length || $(this).find('.visual-options').length ){
            val = $(this).find('input:checked').val();
        }else{
            val = $(this).find('.mfn-field-value, .condition-field, .field-to-object').val();
        }

        mfnoptsinputs.getField(id, val, visibility);
    });
  },

  watchChanges: function() {
    // segmented options is in segmented click function
    $editpanel.on('change', '.watchChanges .mfn-field-value, .watchChanges .condition-field, .watchChanges .field-to-object', function() {
        var $formrow = $(this).closest('.watchChanges');
        var val = $(this).val();
        var id = $formrow.attr('id');
        mfnoptsinputs.getField(id, val);
    });
  },

  getField: function(id, val){
    $('.mfn-ui .mfn-form .activeif-'+id).each(function() {
      var $formrow = $(this);
      mfnoptsinputs.showhidefields($formrow, val);
    });
  },

  showhidefields: function($formrow, val, visibility = true){
    var opt = $formrow.attr('data-opt');
    var optval = $formrow.attr('data-val');

    if( !visibility ){
        $formrow.addClass('conditionally-hide').removeClass('conditionally-show');
        return;
    }

    if( opt == 'is' && ( (val != '' && optval.includes(val)) || (val == '' && optval == '') ) ){
      $formrow.addClass('conditionally-show').removeClass('conditionally-hide');
    }else if( opt == 'isnt' && ( (optval == '' && val != '') || (val == '' && optval != '') || val != optval ) ){
      $formrow.addClass('conditionally-show').removeClass('conditionally-hide');
    }else{
      $formrow.addClass('conditionally-hide').removeClass('conditionally-show');
    }
  },
};

/**
 * Transforms function
*/

const Transforms = {
    // DOM RELATED
    sidebarMenu: '',  // Sidemenu from BeBuilder
    insertSidebarMenu( sidebarMenu ){
        if ( !sidebarMenu.closest('.transform_field') ) return console.error('Wrong DOM location of transform inputs');
        this.sidebarMenu = sidebarMenu;

        return this;
    },

    // CREATION OF TRANSFORM STRING & OBJECT
    readyString: '',              // for BeBuilder preview
    readyStringWithoutRotate: '', // for BeBuilder preview
    transformDuration: 0,         // for BeBuilder preview
    readyObject: {},              // for BeBuilder update info
    createOrExtendObject( queriedValue, transform ) {
        this.readyObject = {...this.readyObject, [transform.key]: queriedValue}
        return this;
    },
    createOrExtendString( queriedValue, transform ) {

        // console.log(queriedValue);
        // First conditional is for ROTATE only
        if (transform.key === this.inputs[this.inputs.length-1].key) {
            this.readyString += queriedValue;
        } else {
            this.readyString += `${queriedValue},`;
        }

        return this;
    },
    createStringWithoutRotate(){
        if (!this.readyString || this.readyString === '') return console.error('String of transforms is not created!');

        // this.readyStringWithoutRotate = this.readyString.split(/,(\d+)(?!.*\d)/)[0];
        let last_index = this.readyString.split(",");
        this.readyStringWithoutRotate = last_index.slice(0, last_index.length - 1).join(",");
        return this;
    },
    createTransformDuration(){
        if (!this.sidebarMenu || this.sidebarMenu === '') return console.error('The sidebar menu DOM is not inserted!');

        transformDuration = $(this.sidebarMenu).closest('.mfn-form-row').siblings('*[data-name="transition"]');
        if (transformDuration) {
            this.transformDuration = $(transformDuration).find('input.mfn-field-value').val();
        }

        return this;
    },

    // INPUTS HANDLER
    inputs: [
        // Matrix array in proper order
        { key: 'scaleX',      domLocation: 'input[data-key="scaleX"]',  defaultValue: 1 },
        { key: 'skewY',       domLocation: 'input[data-key="skewY"]',  defaultValue: 0  },
        { key: 'skewX',       domLocation: 'input[data-key="skewX"]',  defaultValue: 0  },
        { key: 'scaleY',      domLocation: 'input[data-key="scaleY"]', defaultValue: 1  },
        { key: 'translateX',  domLocation: 'input[data-key="translateX"]', defaultValue: 0  },
        { key: 'translateY',  domLocation: 'input[data-key="translateY"]', defaultValue: 0  },

        // Not in matrix array, should be always last arr element!
        { key: 'rotate',      domLocation: 'input[data-key="rotate"]', defaultValue: 0  },
    ],
    loopThrouInputs(){
        this.readyString = ''; //every loop this needs to be refreshed

        for(let transform of this.inputs) {
            let queriedDOM = this.sidebarMenu.closest('.transform_field').find(transform.domLocation);
            let queriedValue = !!queriedDOM.val() ? parseFloat(queriedDOM.val()) : parseFloat(transform.defaultValue);

            this.createOrExtendObject( queriedValue, transform )
            this.createOrExtendString( queriedValue, transform )
        }

        return this;
    },

    // BEBUILDER UI RELATED
    attachInitialMargins(){
        $transforms = $builder.find('.mfn-transformed').find('.mfn-header-transform:not([data-initMarginLeft])');

        $transforms.each(function(index, item){
            const transformSibling = jQuery(item).siblings('.mcb-column-inner').length ? jQuery(item).siblings('.mcb-column-inner') : jQuery(item).siblings('.mcb-wrap-inner');

            jQuery(item).attr('data-initMarginLeft', jQuery(transformSibling).css('marginLeft')).css('marginLeft', jQuery(transformSibling).css('marginLeft'));
            jQuery(item).attr('data-initMarginTop', jQuery(transformSibling).css('marginTop')).css('marginTop', jQuery(transformSibling).css('marginTop'));
        })
    },
    attachNewMargins(){
        if($content && $content.find('.mfn-transformed').length){
            $transforms = $builder.find('.mfn-header-transform[data-initMarginLeft]');

            $transforms.each(function(index, item){
                const transformSibling = jQuery(item).siblings('.mcb-column-inner').length ? jQuery(item).siblings('.mcb-column-inner') : jQuery(item).siblings('.mcb-wrap-inner');

                jQuery(item).css('marginLeft', `${jQuery(transformSibling).css('marginLeft')}`);
                jQuery(item).css('marginTop', `${jQuery(transformSibling).css('marginTop')}`);
            })
        }
    },

    // BEBUILDER PREVIEW OF TRANSFORM
    renderTransforms(){
        const tempInnerClass = $($edited_div).hasClass('wrap') ? `.mcb-wrap-inner` : `.mcb-column-inner`; //left for wrap transforms!
        const uidEdited = $($edited_div).closest('.mfn-current-editing').attr('data-uid');
        const domLocation = this.sidebarMenu.closest('.transform').attr('data-csspath');

        // If has no transform class, add it and attach initial value!
        if( !$($edited_div).hasClass('mfn-transformed') ){
            $($edited_div).addClass('mfn-transformed');
            this.attachInitialMargins();
        }
        addLocalStyle(`${domLocation}`, `matrix(${this.readyStringWithoutRotate}) rotate(${this.readyObject.rotate}deg)`, 'transform', 'desktop', uidEdited);

        return this;
    },

    // EVENTS
    addInputsListener(){

        const that = this;

        $editpanel.on('change', '.transition input', function(){
            $editpanel.trigger('change', '.transform input');
        })

        $editpanel.on('change', '.transform input', function(){
          const sidebarMenu = $(this).closest('.transform').closest('.mfn-form-row.transform');

          that
          .insertSidebarMenu($(sidebarMenu))
          .loopThrouInputs()
          .createStringWithoutRotate()
          .createTransformDuration()
          .renderTransforms();
        })
    },

    // RETURNS
    get(){
        return {readyString: this.readyString, readyObject: this.readyObject, stringWithoutRotate: this.readyStringWithoutRotate, transformDuration: this.transformDuration};
    }
}


/* FIELDS */
$editpanel.on('change', '.panel-edit-item .mfn-form .field-to-object, .panel-edit-item .mfn-form .mfn-field-value', function() {
    getFieldChange($(this));
});

function getFieldChange($field){
    //var $field = $(this);
    var it = $field.closest('.mfn-element-fields-wrapper').attr('data-element');
    var $editrow = $field.closest('.mfn-vb-formrow');

    //console.log('field change '+$field.val());

    if( $editrow.hasClass('themeoption') ) return;
    if( $editrow.hasClass('pageoption') ) return;

    var name = typeof $field.attr('name') !== 'undefined' ? $field.attr('name') : $field.attr('data-name');
    var id = $editrow.attr('data-id');

    var editedd_item = mfnvbvars.pagedata.filter( (item) => item.uid == edited_item.uid )[0];

    if( typeof editedd_item['attr'] === 'undefined' ) editedd_item['attr'] = {};

    if ( $editrow.closest('.transform_field').length ){

        const { readyString, readyObject } = Transforms
            .insertSidebarMenu($editrow)
            .loopThrouInputs()
            .get();

        editedd_item['attr'][id] = {
            ...readyObject,
            ...{'string': readyString}
        };

        $editrow.closest('.transform_field').find('.mfn-pseudo-val').val( readyString );

    }else if( $editrow.find('.separated-fields').length ){
        if( typeof $field.attr('data-key') !== 'undefined' ){
            var keyy = $field.attr('data-key');
            if(  typeof editedd_item['attr'] !== 'undefined' && typeof editedd_item['attr'][id] !== 'undefined' ){
                editedd_item['attr'][id][keyy] = $field.val();
            }else{
                editedd_item['attr'][id] = {};
                editedd_item['attr'][id][keyy] = $field.val();
            }
        }else{
            editedd_item['attr'][id] = $field.val();
        }
    }else if( $editrow.hasClass('typography') ){
        var keyy = $field.attr('data-key');
        var val = $field.val();

        if( keyy.includes('font-family') && val.length ) val = val.replace('#', '');

        if( typeof editedd_item['attr'][id] !== 'undefined' ){
            if( val.length ){
                editedd_item['attr'][id][keyy] = val;
            }else{
                delete( editedd_item['attr'][id][keyy] );

                if( _.isEmpty(editedd_item['attr'][id]) ){
                    delete( editedd_item['attr'][id] );
                }
            }
        }else{
            editedd_item['attr'][id] = {};
            editedd_item['attr'][id][keyy] = val;
        }
    }else if( $editrow.hasClass('filter') ){
        var keyy = $field.attr('data-key');
        if( typeof editedd_item['attr'][id] !== 'undefined' ){
            if( $field.val().length ){
                editedd_item['attr'][id][keyy] = $field.val();
            }else{
                delete(editedd_item['attr'][id][keyy]);
                if( _.isEmpty(editedd_item['attr'][id]) ){
                    delete( editedd_item['attr'][id] );
                }
            }
        }else{
            editedd_item['attr'][id] = {};
            editedd_item['attr'][id][keyy] = $field.val();
        }

    }else if( $editrow.hasClass('gradient') ){
        var keyy = $field.attr('data-key');

        if( typeof editedd_item['attr'][id] !== 'undefined' ){
            if( $field.val().length ){
                editedd_item['attr'][id][keyy] = $field.val();
            }else{
                delete(editedd_item['attr'][id][keyy]);
                if( _.isEmpty(editedd_item['attr'][id]) ){
                    delete( editedd_item['attr'][id] );
                }
            }
        }else{
            editedd_item['attr'][id] = {};
            editedd_item['attr'][id][keyy] = $field.val();
        }
    }else if( $editrow.hasClass('tabs') && $field.closest('li.tab').length ){
        var keyy = $field.attr('data-label');
        var order = $field.attr('data-order');

        if( $field.val().length ){
            if( typeof editedd_item['attr'][id][order][keyy] === 'undefined' ){
                editedd_item['attr'][id][order][keyy] = {};
            }
            editedd_item['attr'][id][order][keyy] = $field.val();
        }else if( typeof editedd_item['attr'][id][order][keyy] !== 'undefined' ){
            delete(editedd_item['attr'][id][order][keyy]);
        }

    }else{

        if( $field.val().length ){
            editedd_item['attr'][name] = $field.val();
        }else if( typeof editedd_item['attr'][name] !== 'undefined' ){
            delete editedd_item['attr'][name];
            if( $field.closest('.mfn-is-modified').length ) $field.closest('.mfn-is-modified').removeClass('mfn-is-modified');
        }

    }

    setTimeout( function() {

        //if( $content.find('.'+it).closest('.mfn-looped-items').length && ( ( $field.val() && $field.val().includes('{') ) || $editrow.hasClass('re_render') || $editrow.hasClass('is_dynamic_data') ) ){

        if( ($field.val() && $field.val().includes('{')) || $editrow.hasClass('is_dynamic_data') ) {

            /*if( (builder_type == 'wrap' && $editrow.hasClass('wrap background-image')) || (builder_type == 'section' && $editrow.hasClass('section background-image')) ){
                return;
            }*/

            // re render whole loop wrapper
            if( $content.find('.'+it).closest('.mfn-queryloop-item-wrapper').length ) {
                re_render( $content.find('.'+it).closest('.mcb-section.vb-item').attr('data-uid') );
            }else{
                re_render( $content.find('.'+it).closest('.vb-item').attr('data-uid') );
            }
            $editrow.addClass('mfn-field-loading');
        }else if( $editrow.hasClass('re_render') || $editrow.hasClass('tabs') ) {
            re_render( edited_item.uid );
            $editrow.addClass('mfn-field-loading');
        }

    }, 100);

    if( !$editrow.hasClass('re_render') && !$editrow.hasClass('disable-history') && !$content.find('.'+it).closest('.mfn-queryloop-item-wrapper').length ) historyStorage.add();
    enableBeforeUnload();

}


$editpanel.on('change paste', '.panel-view-options .mfn-form .mfn-field-value', function() {
    var $editrow = $(this).closest('.mfn-vb-formrow');
    var name = $(this).attr('name');
    var value = $(this).val();

    if( $editrow.find('.checkboxes:not(.pseudo)').length ){

        let data_name = $editrow.attr('data-name');
        let data_key = $(this).val();

        name = data_name;

        if( $(this).is(':checked') ){

            if( typeof edited_item[data_name] !== 'undefined' && typeof edited_item[data_name] !== 'string' ){
                edited_item[data_name][data_key] = value;
            }else{
                edited_item[data_name] = {};
                edited_item[data_name][data_key] = value;
            }

        }else{
            delete(edited_item[data_name][data_key]);
        }

        value = edited_item[data_name];

    }else if( $editrow.find('.multiple-inputs.separated-fields').length ){
        //console.log('separated fields');
        if( typeof $(this).attr('data-key') !== 'undefined' ){

            var keyy = $(this).attr('data-key');
            if(  typeof edited_item[name] === 'undefined' || typeof edited_item[name] === 'string' ) edited_item[name] = {};

            edited_item[name][keyy] = value;

        }else{
            edited_item[name] = value;
        }

        value = edited_item[name];
    }else{
        edited_item[name] = value;
    }

    if( name == 'mfn-post-layout' ){
        $('.panel-view-options .mfn-form .mfn-post-sidebar .mfn-field-value').trigger('change');
        $('.panel-view-options .mfn-form .mfn-post-sidebar2 .mfn-field-value').trigger('change');
    }

    /* header options */
    if( builder_type == 'header' ){

        if( $editrow.hasClass('header_mobile') && value == 'enabled' ){
            $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-mobile"]').removeClass('disabled');
        }else if( $editrow.hasClass('header_mobile') ){
            $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-mobile"]').addClass('disabled');
            $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-default"]').trigger('click');
        }

        if( $editrow.hasClass('header_sticky') && value == 'enabled' ){
            $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-sticky"]').removeClass('disabled');
        }else if( $editrow.hasClass('header_sticky') ){
            $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-sticky"]').addClass('disabled');
            $('.mfn-be-header-builder .mfn-preview-toolbar .mfn-header-type-preview a[data-preview="header-default"]').trigger('click');
        }

        if( $editrow.hasClass('body_offset_header') ){
            if( value == 'active' ){
                $content.find('.mfn-header-tmpl').removeClass('mfn-header-tmpl-absolute');
            }else if(!$content.find('.mfn-header-tmpl').hasClass('mfn-header-tmpl-absolute')){
                $content.find('.mfn-header-tmpl').addClass('mfn-header-tmpl-absolute');
            }
        }

        if( $editrow.hasClass('header_position') ){
            if( value == 'default' ){
                $content.find('.mfn-header-tmpl').removeClass('mfn-header-tmpl-absolute');
            }else if( !$('.body_offset_header .preview-body_offset_headerinput').val().length ){
                $content.find('.mfn-header-tmpl').addClass('mfn-header-tmpl-absolute');
            }

        }

        if( $editrow.hasClass('option header_width') ){
            if( value == 'inherited' ){
                $content.find('.mfn-header-tmpl').addClass('mfn-header-layout-width');
            }else{
                $content.find('.mfn-header-tmpl').removeClass('mfn-header-layout-width');
            }
        }

        if( $editrow.hasClass('option header_sticky_width') ){
            if( value == 'inherited' ){
                $content.find('.mfn-header-tmpl').addClass('mfn-sticky-layout-width');
            }else{
                $content.find('.mfn-header-tmpl').removeClass('mfn-sticky-layout-width');
            }
        }
    }
    /* END header options */

    if( mfnvbvars.view == 'demo' ) return;

    updatePageOpt(name, value);
});


function updatePageOpt(name, value){
    $.ajax( mfnajaxurl, {
        type : "POST",
        data : {
          'mfn-builder-nonce': wpnonce,
          action: 'mfn_post_option',
          id: pageid,
          option: name,
          value: value,
        }

    });
}

// transform events

Transforms.addInputsListener();

/* THEME OPTIONS */

$editpanel.on('keyup paste change', '.themeoption.logo-text .mfn-field-value', function() {
    let val = $(this).val();
    if( val.length ){
        $content.find('#Top_bar .logo, #Header_creative .logo').addClass('text-logo');
        $content.find('#Top_bar .logo #logo, #Header_creative .logo #logo').html(val);
    }else{
        $content.find('#Top_bar .logo, #Header_creative .logo').removeClass('text-logo');
        $content.find('#Top_bar .logo #logo, #Header_creative .logo #logo').html('<img class="logo-main scale-with-grid " src="'+mfnvbvars.themepath+'/images/logo/logo.png" alt="Luk test"><img class="logo-sticky scale-with-grid" src="'+mfnvbvars.themepath+'/images/logo/logo.png" alt="Luk test"><img class="logo-mobile scale-with-grid " src="https://muffingroup.com/dev8624/lukas/woo/wp-content/uploads/2021/08/clothingstore-mobile.webp" alt="Luk test"><img class="logo-mobile-sticky scale-with-grid " src="'+mfnvbvars.themepath+'/images/logo/logo.png" alt="Luk test">');
    }
});

$editpanel.on('keyup paste change', '.themeoption.header-slogan .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Action_bar').length ) return;

    if( val.length ){
        if( $content.find('#Action_bar .contact_details .slogan').length ){
            $content.find('#Action_bar .contact_details .slogan').html(val);
        }else{
            $content.find('#Action_bar .contact_details').prepend('<li class="slogan">'+val+'</li>');
        }
    }else{
        $content.find('#Action_bar .contact_details .slogan').remove();
    }
});

$editpanel.on('keyup paste change', '.themeoption.header-phone .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Action_bar').length ) return;

    if( val.length ){
        if( $content.find('#Action_bar .contact_details .phone-1 a').length ){
            $content.find('#Action_bar .contact_details .phone-1 a').html(val);
        }else{
            $content.find('#Action_bar .contact_details').append('<li class="phone phone-1"><i class="icon-phone" aria-label="phone icon"></i><a href="#">'+val+'</a></li>');
        }
    }else{
        $content.find('#Action_bar .contact_details .phone-1').remove();
    }
});

$editpanel.on('keyup paste change', '.themeoption.header-phone-2 .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Action_bar').length ) return;

    if( val.length ){
        if( $content.find('#Action_bar .contact_details .phone-2 a').length ){
            $content.find('#Action_bar .contact_details .phone-2 a').html(val);
        }else{
            $content.find('#Action_bar .contact_details').append('<li class="phone phone-2"><i class="icon-phone" aria-label="phone icon"></i><a href="#">'+val+'</a></li>');
        }
    }else{
        $content.find('#Action_bar .contact_details .phone-2').remove();
    }
});

$editpanel.on('keyup paste change', '.themeoption.header-email .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Action_bar').length ) return;

    if( val.length ){
        if( $content.find('#Action_bar .contact_details .mail a').length ){
            $content.find('#Action_bar .contact_details .mail a').html(val);
        }else{
            $content.find('#Action_bar .contact_details').append('<li class="mail"><i class="icon-mail-line" aria-label="mail icon"></i><a href="#">'+val+'</a></li>');
        }
    }else{
        $content.find('#Action_bar .contact_details .mail').remove();
    }
});

$editpanel.on('keyup paste change', '.themeoption.footer-copy .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Footer .footer_copy .copyright').length ) return;

    if( val.length ){
        $content.find('#Footer .footer_copy .copyright').html(val);
    }else{
        $content.find('#Footer .footer_copy .copyright').html('&copy; '+new Date().getFullYear()+' Betheme by <a href="https://muffingroup.com" target="_blank">Muffin group</a> | All Rights Reserved | Powered by <a href="https://wordpress.org" target="_blank">WordPress</a>');
    }
});

$editpanel.on('keyup paste change', '.themeoption.header-menu-text .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('.mobile-header-mini #Top_bar a.responsive-menu-toggle').length ) return;

    if( val.length ){
        $content.find('.mobile-header-mini #Top_bar a.responsive-menu-toggle').html('<span>'+val+'</span>');
    }else{
        $content.find('.mobile-header-mini #Top_bar a.responsive-menu-toggle').html('<i class="icon-menu-fine" aria-hidden="true"></i>');
    }
});

$editpanel.on('keyup paste change', '.themeoption.footer-call-to-action .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Footer').length ) return;

    if( val.length ){
        if( $content.find('#Footer .footer_action .mcb-column-inner').length ){
            $content.find('#Footer .footer_action .mcb-column-inner').html(val);
        }else{
            $content.find('#Footer').prepend('<div class="footer_action"><div class="container"><div class="column one mobile-one"><div class="mcb-column-inner">'+val+'</div></div></div></div>');
        }
    }else{
        $content.find('#Footer .footer_action').remove();
    }
});

$editpanel.on('keyup paste change', '.themeoption.header-action-title .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#Header_wrapper .top_bar_right_wrapper').length ) return;

    if( val.length ){
        if( $content.find('#Header_wrapper .top_bar_right_wrapper .action_button.top-bar-right-button').length ){
            $content.find('#Header_wrapper .top_bar_right_wrapper .action_button.top-bar-right-button').html(val);
        }else{
            $content.find('#Header_wrapper .top_bar_right_wrapper').append('<a href="#" class="action_button top-bar-right-button ">'+val+'</a>');
        }
    }else{
        $content.find('#Header_wrapper .top_bar_right_wrapper .action_button.top-bar-right-button').remove();
    }
});

$editpanel.on('keyup paste change', '.themeoption.gdpr-content .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#mfn-gdpr').length ) return;

    $content.find('#mfn-gdpr .mfn-gdpr-content').html(val);
});

$editpanel.on('keyup paste change', '.themeoption.gdpr-content-button_text .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#mfn-gdpr').length ) return;

    $content.find('#mfn-gdpr .mfn-gdpr-button').html(val);
});

$editpanel.on('keyup paste change', '.themeoption.gdpr-content-more_info_text .mfn-field-value', function() {
    let val = $(this).val();
    if( !$content.find('#mfn-gdpr').length ) return;

    $content.find('#mfn-gdpr .mfn-gdpr-readmore').html(val);
});


$editpanel.on('click', '.themeoption .ajax a', function(e) {
    e.preventDefault();
    //console.log('randomize');
});

$editpanel.on('change paste', '.panel-view-themeoptions .mfn-form input:not(.mfn-prevent-change), .panel-view-themeoptions .mfn-form .mfn-field-value', function() {
    var $editrow = $(this).closest('.mfn-vb-formrow');
    var name = $(this).attr('name');
    var value = $(this).val();

    if( $editrow.find('.multiple-inputs').length ){

        let data_name = $editrow.attr('name');
        let data_key = typeof $(this).attr('data-key') !== 'undefined' ? $(this).attr('data-key') : 'color';

        if( value.length ) {
            //console.log(data_name+' / '+data_key+' / '+value);
            if( typeof edited_item[data_name] !== 'undefined' && typeof edited_item[data_name] !== 'string' ) {
                edited_item[data_name][data_key] = value;
            }else{
                edited_item[data_name] = {};
                edited_item[data_name][data_key] = value;
            }
        }else{
            delete(edited_item[data_name][data_key]);
        }

    }else if( $editrow.find('.checkboxes').length ){

        let data_name = $(this).attr('name');
        let data_key = $(this).attr('data-key');

        if( $(this).is(':checked') ){
            if( typeof edited_item[data_name] !== 'undefined' && typeof edited_item[data_name] !== 'string' ) {
                edited_item[data_name][data_key] = value;
            }else{
                edited_item[data_name] = {};
                edited_item[data_name][data_key] = value;
            }
        }else{
            delete(edited_item[data_name][data_key]);
        }

    }else if( $editrow.find('.added-sidebars').length ){
        name = $(this).attr('name');

        if( !value.length ) {
            delete( edited_item[name][$(this).attr('data-key')] );
        }else{

            if( typeof edited_item[name] === 'undefined' && typeof edited_item[name] !== 'array' ){
                edited_item[name] = [];
            }

            edited_item[name].push(value);
        }

    }else if( $editrow.find('.social-icons').length ){
        let data_key = $(this).closest('li').length ? $(this).closest('li').attr('data-key') : $(this).attr('data-key');
        let data_name = $editrow.attr('data-name');

        if( typeof edited_item[data_name] !== 'undefined' && typeof edited_item[data_name] !== 'string' ) {
            edited_item[data_name][data_key] = value;
        }else{
            edited_item[data_name] = {};
            edited_item[data_name][data_key] = value;
        }

    }else if( $editrow.find('.color-picker.multi').length ){
        let data_name = $(this).attr('name');
        let data_key = $(this).attr('data-key');

        if( value.length ){

            if( typeof edited_item[data_name] !== 'undefined' && typeof edited_item[data_name] !== 'string' ) {
                edited_item[data_name][data_key] = value;
            }else{
                edited_item[data_name] = {};
                edited_item[data_name][data_key] = value;
            }

        }else{
            delete(edited_item[data_name][data_key]);
        }

    }else if( $editrow.find('.form-group.typography').length ){

        let data_name = $(this).attr('name');
        let data_key = $(this).attr('data-obj');

        if( value.length ){

            if( typeof edited_item[data_name] !== 'undefined' && typeof edited_item[data_name] !== 'string' ) {
                edited_item[data_name][data_key] = value;
            }else{
                edited_item[data_name] = {};
                edited_item[data_name][data_key] = value;
            }

        }else{
            delete(edited_item[data_name][data_key]);
        }

    }else{
        edited_item[name] = value;
    }


    if( $editrow.hasClass('themeoption') && ($editrow.hasClass('img-page-bg') || $editrow.hasClass('img-subheader-bg') || $editrow.hasClass('top-bar-bg-img') || $editrow.hasClass('subheader-image') || $editrow.hasClass('footer-bg-img') ) ) {
        // themeoption background image

        var field_class = 'img-page-bg';
        var style_path = 'html';

        if( $editrow.hasClass('img-subheader-bg') ){
            field_class = 'img-subheader-bg';
            style_path = 'body:not(.template-slider) #Header_wrapper';
        }else if( $editrow.hasClass('top-bar-bg-img') ){
            field_class = 'top-bar-bg-img';
            style_path = '#Top_bar, #Header_creative';
        }else if( $editrow.hasClass('subheader-image') ){
            field_class = 'subheader-image';
            style_path = '#Subheader';
        }else if( $editrow.hasClass('footer-bg-img') ){
            field_class = 'footer-bg-img';
            style_path = '#Footer';
        }

        if( $content.find('style#themeoption'+field_class).length ) $content.find('style#themeoption'+field_class).remove();
        $content.find('body').append('<style id="themeoption'+field_class+'">'+style_path+'{background-image: '+( value.length ? 'url('+value+')' : 'none' )+'; }</style>');
    }else if($editrow.hasClass('themeoption') && ( $editrow.hasClass('position-page-bg') || $editrow.hasClass('img-subheader-attachment') || $editrow.hasClass('top-bar-bg-position') || $editrow.hasClass('subheader-position') || $editrow.hasClass('footer-bg-img-position') ) ){
        // themeoptions bg position | repeat
        var val_helper = value.split(';');
        var val_string = '';
        var field_class = 'position-page-bg';
        var style_path = 'html';

        if( $editrow.hasClass('img-subheader-attachment') ) {
            field_class = 'img-subheader-attachment';
            style_path = 'body:not(.template-slider) #Header_wrapper';
        }else if( $editrow.hasClass('top-bar-bg-position') ) {
            field_class = 'top-bar-bg-position';
            style_path = '#Top_bar, #Header_creative';
        }else if( $editrow.hasClass('subheader-position') ) {
            field_class = 'subheader-position';
            style_path = '#Subheader';
        }else if( $editrow.hasClass('footer-bg-img-position') ) {
            field_class = 'footer-bg-img-position';
            style_path = '#Footer';
        }

        if( val_helper[0] != '' ) val_string += 'background-repeat: '+val_helper[0]+';';
        if( val_helper[1] != '' ) val_string += 'background-position: '+val_helper[1]+';';
        if( val_helper[2] != '' ) val_string += 'background-attachment: '+val_helper[2]+';';
        if( val_helper[3] != '' ) val_string += 'background-size: '+val_helper[3]+';';

        if( $content.find('style#'+field_class).length ){
            $content.find('style#'+field_class).html(style_path+'{ '+val_string+' }');
        }else{
            $content.find('body').append('<style id="'+field_class+'">'+style_path+'{'+val_string+'}</style>');
        }
    }else if( $editrow.hasClass('themeoption') && ( $editrow.hasClass('size-page-bg') || $editrow.hasClass('size-subheader-bg') || $editrow.hasClass('subheader-size') || $editrow.hasClass('footer-bg-img-size') ) ){
        // theme options bg image size

        var field_class = 'size-page-bg';
        var style_path = 'html';

        if( $editrow.hasClass('size-subheader-bg') ) {
            field_class = 'size-subheader-bg';
            style_path = 'body:not(.template-slider) #Header_wrapper';
        }else if( $editrow.hasClass('subheader-size') ) {
            field_class = 'subheader-size';
            style_path = '#Subheader';
        }else if( $editrow.hasClass('footer-bg-img-size') ) {
            field_class = 'footer-bg-img-size';
            style_path = '#Footer';
        }

        if( $content.find('style#themeoption'+field_class+'').length ){
            $content.find('style#themeoption'+field_class+'').html(style_path+'{background-size: '+value+'; }');
        }else{
            $content.find('body').append('<style id="themeoption'+field_class+'">'+style_path+'{background-size: '+value+'; }</style>');
        }
    }else if($editrow.hasClass('themeoption favicon-img')){
        // favicon
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        if( value.length ){
            link.href = value;
        }else{
            link.href = mfnvbvars.themepath+'/images/favicon.ico';
        }
    }else if($editrow.hasClass('themeoption logo-vertical-padding')){
        // logo vertical padding
        if( $content.find('style#themeoptionlogo-vertical-padding').length ) $content.find('style#themeoptionlogo-vertical-padding').remove();
        if( value.length ) $content.find('body').append('<style id="themeoptionlogo-vertical-padding">#Top_bar #logo, .header-fixed #Top_bar #logo, .header-plain #Top_bar #logo, .header-transparent #Top_bar #logo{padding: '+(value.length ? value : '15')+'px 0px;}</style>');
    }else if($editrow.hasClass('themeoption logo-vertical-align')){
        // logo vertical align
        $content.find('body').removeClass('logo-valign-top logo-valign-bottom');
        if( value.length ) $content.find('body').addClass('logo-valign-'+value);
    }else if($editrow.hasClass('themeoption button-style')){
        // logo height
        $content.find('body').removeClass('button-default button-flat button-flat button-round button-stroke button-custom');
        if( value.length ) { $content.find('body').addClass('button-'+value); } else{ $content.find('body').addClass('button-default'); }
    }else if($editrow.hasClass('themeoption header-fw')){
        // header options
        $content.find('body').removeClass('header-fw header-boxed');
        $editrow.find('ul li input').each(function() {
            if( $(this).is(':checked') ){
                if( $(this).val() == 'full-width' ){
                    $content.find('body').addClass('header-fw');
                }else{
                    $content.find('body').addClass( $(this).val() );
                }
            }
        });
    }else if($editrow.hasClass('themeoption logo-advanced')){
        // logo advanced
        $content.find('body').removeClass('logo-no-margin logo-overflow logo-no-sticky-padding logo-sticky-width-auto');
        $editrow.find('ul li input').each(function() {
            if( $(this).is(':checked') ){
                $content.find('body').addClass( 'logo-'+$(this).val() );
            }
        });
    }else if($editrow.hasClass('themeoption transparent')){
        $content.find('body').removeClass('tr-header tr-menu tr-content tr-footer');
        $editrow.find('ul li input').each(function() {
            if( $(this).is(':checked') ){
                $content.find('body').addClass('tr-'+$(this).val());
            }
        });
    }else if($editrow.hasClass('themeoption menu-options')){
        // menu options
        $content.find('body').removeClass('menuo-right menuo-arrows menuo-no-borders menuo-sub-active menuo-last');
        $editrow.find('ul li input').each(function() {
            if( $(this).is(':checked') ){
                if( $(this).val() == 'align-right' ){
                    $content.find('body').addClass('menuo-right');
                }else if( $(this).val() == 'menu-arrows' ){
                    $content.find('body').addClass('menuo-arrows');
                }else if( $(this).val() == 'hide-borders' ){
                    $content.find('body').addClass('menuo-no-borders');
                }else if( $(this).val() == 'submenu-active' ){
                    $content.find('body').addClass('menuo-sub-active');
                }else if( $(this).val() == 'last' ){
                    $content.find('body').addClass('menuo-last');
                }
            }
        });
    }else if($editrow.hasClass('themeoption sticky-header-style')){
        // themeoption sticky header style
        $content.find('body').removeClass('sticky-tb-color sticky-white sticky-dark');
        $content.find('body').addClass('sticky-'+value);
    }else if($editrow.hasClass('themeoption subheader-style')){
        // themeoption sticky header style
        $content.find('body').removeClass('subheader-title-left subheader-both-center subheader-both-left subheader-both-right subheader-title-right');
        if( value.length ) { $content.find('body').addClass('subheader-'+value); }else{ $content.find('body').addClass('subheader-title-left'); }
    }else if($editrow.hasClass('themeoption subheader-padding')){
        // themeoption subheader padding
        if( $content.find('style#themeoptionsubheader-padding').length ) $content.find('style#themeoptionsubheader-padding').remove();
        $content.find('body').append('<style id="themeoptionsubheader-padding">#Subheader{padding: '+( value.length ? value : '60px 0 45px' )+' }</style>');
    }else if($editrow.hasClass('themeoption subheader-title-tag')){
        // themeoption title tag
        if( $content.find('#Subheader .title').length ){
            $content.find('#Subheader .title').replaceWith('<'+value+' class="title">'+$content.find('#Subheader .title').html()+'</'+value+'>');
        }
    }else if($editrow.hasClass('themeoption shop-align')){
        // themeoption shop txt align
        $content.find('.woocommerce ul.products li.product').removeClass('align-left align-right align-center');
        $content.find('.woocommerce ul.products li.product').addClass('align-'+(value.length ? value : 'center'));
    }else if($editrow.hasClass('themeoption shop-title-tag')){
        // themeoption title tag
        if( $content.find('.woocommerce ul.products li.product .desc .mfn-woo-product-title').length ){
            $content.find('.woocommerce ul.products li.product .desc .mfn-woo-product-title').each(function() {
                $(this).replaceWith('<'+(value.length ? value : 'h4')+' class="mfn-woo-product-title">'+$(this).html()+'</'+(value.length ? value : 'h4')+'>');
            });
        }
    }else if($editrow.hasClass('themeoption related-style')){
        // themeoption related posts
        if( !$content.find('.section-related-adjustment').length ) return;
        $content.find('.section-related-adjustment').removeClass('simple');
        if( value.length ) $content.find('.section-related-adjustment').addClass('simple');
    }else if($editrow.hasClass('themeoption subheader-title-tag')){
        // themeoption title tag
        if( $content.find('#Intro .intro-title').length ){
            $content.find('#Intro .intro-title').replaceWith('<'+value+' class="intro-title">'+$content.find('#Intro .intro-title').html()+'</'+value+'>');
        }
    }else if($editrow.hasClass('themeoption blog-title-tag')){
        // themeoption title tag blog
        if( $content.find('.post-item .entry-title').length ){
            $content.find('.post-item .entry-title').each(function() {
                $(this).replaceWith('<h'+value+' class="entry-title">'+$(this).html()+'</h'+value+'>');
            });
        }
    }else if($editrow.hasClass('themeoption sidebar-width')){
        // themeoption sidebar width
        if( $content.find('style#themeoptionsidebar-width').length ) $content.find('style#themeoptionsidebar-width').remove();
        $content.find('body').append('<style id="themeoptionsidebar-width">.with_aside .sidebar.columns{width: '+( value.length ? value+'%' : '23%' )+' }.with_aside .sections_group{width:'+( value.length ? (100-value)+'%' : '75%' )+'}</style>');
    }else if($editrow.hasClass('themeoption sidebar-style')){
        // themeoption sidebar style
        if( !$content.find('.sidebar').length ) return;
        $content.find('.sidebar').removeClass('style-simple style-classic');
        if( value.length ) $content.find('.sidebar').addClass('style-'+value);
    }else if($editrow.hasClass('themeoption sidebar-lines')){
        // themeoption sidebar style
        if( !$content.find('.sidebar').length ) return;
        $content.find('.sidebar').removeClass('lines-hidden lines-boxed has-lines');
        if( value.length && value == 'lines-hidden'){
            $content.find('.sidebar').addClass('lines-hidden')
        }else{
            if(value == 'lines-boxed') $content.find('.sidebar').addClass('lines-boxed');
            $content.find('.sidebar').addClass('has-lines')
        }
    }else if($editrow.hasClass('themeoption footer-align')){
        // themeoption footer text align
        if( !$content.find('#Footer .widgets_wrapper').length ) return;
        $content.find('#Footer .widgets_wrapper').removeClass('center');
        if( value.length && value == 'center' ) $content.find('#Footer .widgets_wrapper').addClass('center');
    }else if($editrow.hasClass('themeoption mobile-header-height')){
        // themeoption mobile header height
        if( $content.find('style#themeoptionmobile-header-height').length ) $content.find('style#themeoptionmobile-header-height').remove();
        $content.find('body').append('<style id="themeoptionmobile-header-height">@media only screen and (max-width: 767px){body:not(.template-slider) #Header{min-height: '+( value.length ? value+'px' : ( $('.panel-view-themeoptions .themeoption.header-height .mfn-field-value').val().length ? $('.panel-view-themeoptions .themeoption.header-height .mfn-field-value').val()+'px' : '250px' ) )+' }}</style>');
    }else if($editrow.hasClass('themeoption mobile-header-height')){
        // themeoption mobile header height
        if( $content.find('style#themeoptionmobile-header-height').length ) $content.find('style#themeoptionmobile-header-height').remove();
        $content.find('body').append('<style id="themeoptionmobile-header-height">@media only screen and (max-width: 767px){body:not(.template-slider) #Header{min-height: '+( value.length ? value+'px' : ( $('.panel-view-themeoptions .themeoption.header-height .mfn-field-value').val().length ? $('.panel-view-themeoptions .themeoption.header-height .mfn-field-value').val()+'px' : '250px' ) )+' }}</style>');
    }else if($editrow.hasClass('themeoption mobile-subheader-padding')){
        // themeoption mobile header subheader padding
        if( $content.find('style#themeoptionmobile-subheader-padding').length ) $content.find('style#themeoptionmobile-subheader-padding').remove();
        $content.find('body').append('<style id="themeoptionmobile-subheader-padding">@media only screen and (max-width: 767px){body:not(.template-slider) #Subheader{padding: '+( value.length ? value+'px' : ( $('.panel-view-themeoptions .themeoption.subheader-padding .mfn-field-value').val().length ? $('.panel-view-themeoptions .themeoption.header-height .mfn-field-value').val() : '30px 0' ) )+' }}</style>');
    }else if( $editrow.hasClass('themeoption layout-boxed-padding') ){
        // themeoption boxed layout padding
        if( $content.find('style#themeoptionlayout-boxed-padding').length ) $content.find('style#themeoptionlayout-boxed-padding').remove();
        $content.find('body').append('<style id="themeoptionlayout-boxed-padding">@media only screen and (min-width: 768px){.layout-boxed #Subheader .container, .layout-boxed:not(.with_aside) .section:not(.full-width), .layout-boxed.with_aside .content_wrapper, .layout-boxed #Footer .container{padding-left: '+( value.length ? value : '0' )+';padding-right: '+( value.length ? value : '0' )+'}}</style>');
    }else if( $editrow.hasClass('themeoption content-remove-padding') ){
        // themeoption content top padding
        if( $content.find('style#themeoptioncontent-remove-padding').length ) $content.find('style#themeoptioncontent-remove-padding').remove();
        $content.find('body').append('<style id="themeoptioncontent-remove-padding">#Content{padding-top: '+( value.length && value == '1' ? '0px' : '30px' )+';}</style>');
    }else if($editrow.hasClass('themeoption layout-options')){
        // menu options
        $content.find('body').removeClass('no-shadows boxed-no-margin');
        $editrow.find('ul li input').each(function() {
            if( $(this).is(':checked') ){
                $content.find('body').addClass($(this).val());
            }
        });
    }else if($editrow.hasClass('themeoption sticky-header-style')){
        // theme option sticky header style
        $content.find('body').removeClass('sticky-tb-color sticky-white sticky-dark');
        $content.find('body').addClass('sticky-'+value);
    }else if($editrow.hasClass('themeoption shop-icon-wishlist')){
        // theme option icon wishlist shop
        if( value == '' ){
            $content.find('a#wishlist_button').html('<svg width="26" viewBox="0 0 26 26" aria-label="wishlist icon"><defs><style>.path{fill:none;stroke:#333;stroke-width:1.5px;}</style></defs><path class="path" d="M16.7,6a3.78,3.78,0,0,0-2.3.8A5.26,5.26,0,0,0,13,8.5a5,5,0,0,0-1.4-1.6A3.52,3.52,0,0,0,9.3,6a4.33,4.33,0,0,0-4.2,4.6c0,2.8,2.3,4.7,5.7,7.7.6.5,1.2,1.1,1.9,1.7H13a.37.37,0,0,0,.3-.1c.7-.6,1.3-1.2,1.9-1.7,3.4-2.9,5.7-4.8,5.7-7.7A4.3,4.3,0,0,0,16.7,6Z"></path></svg>');
        }else{
            $content.find('a#wishlist_button').html('<i class="'+value+'"></i>');
        }
    }else if($editrow.hasClass('themeoption shop-cart')){
        // theme option icon cart shop
        $content.find('a.header-cart svg').remove();
        $content.find('a.header-cart i').remove();
        if( value == '' ){
            $content.find('a.header-cart').prepend('<svg width="26" viewBox="0 0 26 26" aria-label="cart icon"><defs><style>.path{fill:none;stroke:#333;stroke-miterlimit:10;stroke-width:1.5px;}</style></defs><polygon class="path" points="20.4 20.4 5.6 20.4 6.83 10.53 19.17 10.53 20.4 20.4"></polygon><path class="path" d="M9.3,10.53V9.3a3.7,3.7,0,1,1,7.4,0v1.23"></path></svg>');
        }else{
            $content.find('a.header-cart').prepend('<i class="'+value+'"></i>');
        }
    }else if($editrow.hasClass('themeoption gdpr')){
        if( value.length && value == '1' ){
            if( !$content.find('#mfn-gdpr').length ) $content.find('body').append(renderMfnFields.gdpr);
            if( !$content.find('#mfn-gdpr').hasClass('show') ) $content.find('#mfn-gdpr').addClass('show');
        }else{
            $content.find('#mfn-gdpr').removeClass('show');
        }
    }else if( $editrow.hasClass('themeoption gdpr-settings-position') ){
        if( value == 'top' ){
            $content.find('#mfn-gdpr').attr('data-aligment', 'top').attr('data-direction', 'horizontal');
        }else if( value == 'bottom' ){
            $content.find('#mfn-gdpr').attr('data-aligment', 'bottom').attr('data-direction', 'horizontal');
        }else if( value == 'left' ){
            $content.find('#mfn-gdpr').attr('data-aligment', 'left').attr('data-direction', 'vertical');
        }else if( value == 'right' ){
            $content.find('#mfn-gdpr').attr('data-aligment', 'right').attr('data-direction', 'vertical');
        }
    }else if( $editrow.hasClass('to-inline-style') ){

        let std = typeof $editrow.attr('data-std') !== 'undefined' ? $editrow.attr('data-std') : $(this).attr('data-std');
        let csspath = $editrow.attr('data-csspath');
        let resp = $editrow.attr('data-responsive');
        let mediaq = '';
        let unit = typeof $editrow.attr('data-unit') !== 'undefined' ? $editrow.attr('data-unit') : $(this).attr('data-unit');
        let style = typeof $editrow.attr('data-style') !== 'undefined' ? $editrow.attr('data-style') : $(this).attr('data-style');
        let style_id = 'themeoption'; if( typeof $editrow.attr('data-name') !== 'undefined' ) style_id += $editrow.attr('data-name'); if( typeof $(this).attr('data-key') !== 'undefined' ) style_id += $(this).attr('data-key');

        if( $editrow.find('.color-picker.multi').length && typeof $(this).attr('data-key') !== 'undefined' && $(this).attr('data-key') == 'hover' ){
            csspath = csspath.replaceAll(', ', ',').replaceAll(',', ':hover,')+':hover';
            //style_id += 'hover';
        }

        if( $editrow.find('.multiple-inputs').length ){
            value = '';

            if( $editrow.find('.color-mirror-source').length ){
                $editrow.find('.color-mirror .mfn-to-bs-input').val( $editrow.find('.color-mirror-source .mfn-field-value').val() );
            }

            $editrow.find('.multiple-inputs input.mfn-to-bs-input').each(function(i) {
                var units_check = false;
                var val = $(this).val();
                unit = $(this).attr('data-unit');

                if( i > 0 ) value += ' ';

                if( val.length ){

                    $.each( units, function( i, el ) {
                        if( val.includes(el) ){
                            units_check = true;
                        }
                    });

                    if(units_check == false){
                        value += val+unit;
                        $(this).val(val+unit);
                    }else{
                        value += val;
                    }

                }

                //console.log($(this).val());

            });

            //$editrow.find('.multiple-inputs .mfn-field-value').trigger('change');

            //console.log( value );
        }

        if( $content.find('style#'+style_id).length ) $content.find('style#'+style_id).remove();

        if( resp == 'tablet' ) mediaq = '@media only screen and (max-width: 959px) {';
        if( resp == 'mobile' ) mediaq = '@media only screen and (max-width: 767px) {';

        if( resp == 'desktop' ){
            $content.find('head').append('<style id="'+style_id+'">'+csspath+'{'+style+': '+( value.length ? value+unit : ( std && std.length ? std+unit : 'inherit' ) )+';}</style>');
        }else if( resp == 'tablet' ){
            $content.find('body').prepend('<style id="'+style_id+'">'+mediaq+csspath+'{'+style+': '+( value.length ? value+unit : ( std && std.length ? std+unit : 'inherit' ) )+';}}</style>');
        }else{
            $content.find('body').append('<style id="'+style_id+'">'+mediaq+csspath+'{'+style+': '+( value.length ? value+unit : ( std && std.length ? std+unit : 'inherit' ) )+';}}</style>');
        }

        if( style == 'font-family' && value.length ){
            var fonts_group = $(this).find(':selected').closest('optgroup').attr('label');
            if( fonts_group == 'Google Fonts' ){
                WebFont.load({
                    google: {
                      families: [value]
                    },
                    context: window.frames[0].frameElement.contentWindow,
                    /*fontactive: function(familyName,fvd){
                        self.handleTypoChange( style_attr, familyName );
                        return;
                    },*/
                });
            }
        }
    }

    if( mfnvbvars.view == 'demo' ) return;

    $.ajax( mfnajaxurl, {
    type : "POST",
    data : {
      'mfn-builder-nonce': wpnonce,
      action: 'mfn_vb_themeoptions',
      betheme: edited_item
    },
    success: function(response){

        // re render content for few options
        if($editrow.hasClass('re_render_to themeoption')) {

            // check if element is in iframe
            if( $editrow.hasClass('re_render_if') ) {
                var re_type = $editrow.attr('data-retype');
                var re_elem = $editrow.attr('data-reelement');

                if( re_type == 'div' && !$content.find(re_elem).length ) {
                    return;
                }

                if( typeof window.onbeforeunload !== 'function' ) {
                    refreshIframe();
                    return;
                }else{

                    $('.mfn-ui').addClass('mfn-modal-open').append('<div class="mfn-modal modal-confirm show"> <div class="mfn-modalbox mfn-form mfn-shadow-1"> <div class="modalbox-header"> <div class="options-group"> <div class="modalbox-title-group"> <span class="modalbox-icon mfn-icon-delete"></span> <div class="modalbox-desc"> <h4 class="modalbox-title">Confirm preview</h4> </div></div></div><div class="options-group"> <a class="mfn-option-btn mfn-option-blank btn-large btn-modal-close btn-modal-abort" title="Close" href="#"><span class="mfn-icon mfn-icon-close"></span></a> </div></div><div class="modalbox-content"> <img class="icon" alt="" src="'+mfnvbvars.themepath+'/muffin-options/svg/warning.svg"> <h3>Confirm preview</h3> <p>Unsaved changes. Continue?</p><a class="mfn-btn btn-modal-abort" href="#"><span class="btn-wrapper">Let me save first</span></a> <a class="mfn-btn mfn-btn-red btn-wide btn-modal-confirm" href="#"><span class="btn-wrapper">Refresh</span></a> </div></div></div>');

                    $('.btn-modal-abort').on('click', function(e) {
                        e.preventDefault();
                        $('.mfn-ui').removeClass('mfn-modal-open');
                        $('.modal-confirm.show').remove();
                    });

                    $('.btn-modal-confirm').on('click', function(e) {
                        e.preventDefault();
                        refresh = true;
                        $('.modal-confirm.show').remove();
                        $('body').addClass('mfn-preloader-active');
                        $('.mfn-preloader').fadeIn(300);
                        $('.mfn-preloader .loading-text').text('Please wait...');
                        scroll_top = $content.find("html, body").scrollTop();
                        refreshIframe();
                        return;

                    });

                }

            }

        }else{
            $content.find('body').removeClass('mfn-loading');
        }

    }

});

});


function refreshIframe(){
    $content = false;
    $builder = false;
    iframe = false;

    document.getElementById('mfn-preview-wrapper').innerHTML = '<iframe id="mfn-vb-ifr" src="'+mfnvbvars.permalink+'" allowfullscreen="1"></iframe>';
    jQuery('iframe#mfn-vb-ifr').on('load', function() {

        $content = jQuery("iframe#mfn-vb-ifr").contents();
        $builder = $content.find('.mfn-default-content-buider');
        iframe = document.getElementById("mfn-vb-ifr").contentWindow;

        iframeReady();

        $('body').removeClass('mfn-preloader-active');
        $('.mfn-preloader').hide();
        $content.find("html, body").scrollTop(scroll_top);

        //initWyswig();

    });
}

/**
 *
 * NEW ACM end
 *
 **/

mfnoptsinputs.watchChanges();

return {
  init: init,
  addHistory: historyStorage.add,
  wpnonce: wpnonce,
  re_render: re_render,
  dynamicData:dynamicData,
  settings: settings,
  changeInlineStyles: changeInlineStyles,
  enableBeforeUnload: enableBeforeUnload
};

})(jQuery);

MfnVbApp.settings.detectOsTheme();

function loadIframe(){
    document.getElementById('mfn-preview-wrapper').innerHTML = '<iframe id="mfn-vb-ifr" src="'+mfnvbvars.permalink+'" allowfullscreen="1"></iframe>';
    jQuery('iframe#mfn-vb-ifr').on('load', function() {

        $content = jQuery("iframe#mfn-vb-ifr").contents();
        $builder = $content.find('.mfn-default-content-buider');
        iframe = document.getElementById("mfn-vb-ifr").contentWindow;

        //Templates!
        if( jQuery('body').hasClass('mfn-template-section') ) {
          jQuery(this).contents().find('body').addClass('mfn-template-section')
        } else if( jQuery('body').hasClass('mfn-template-wrap') ) {
          jQuery(this).contents().find('body').addClass('mfn-template-wrap')
        }

        MfnVbApp.init();

        //Global wraps
        if( jQuery('body').hasClass('mfn-template-wrap') && $content.find('.mfn-section-start').length ) {
          const sectionButton = $content.find('#Content').find('.mfn-builder-content').find('a.mfn-btn.mfn-section-add');
          sectionButton.trigger('click');

          setTimeout(function(){
            const wrapButton = $content.find('#Content').find('.mfn-builder-content').find('.wrap-11');
            wrapButton.trigger('click');
          }, 1000);
        }

    });
}

(function($) {
$(document).ready(function() {

    /*$('.mfn-preloader').fadeOut(500, function() {
            $('body').removeClass('mfn-preloader-active');
        });

    return;*/

    $('.mfn-preloader .loading-text').fadeOut(function() {
        $('.mfn-preloader .loading-text').html('Loading page content <div class="dots"></div>');
    }).fadeIn();

    loadIframe();

});
}(jQuery));

/**
* Clone fix
* Fixed native clone function for textarea and select fields
*/

(function(original) {
jQuery.fn.clone = function() {
  var result = original.apply(this, arguments),
    my_textareas = this.find('textarea:not(.editor), select'),
    result_textareas = result.find('textarea:not(.editor), select');

  for (var i = 0, l = my_textareas.length; i < l; ++i) {
    jQuery(result_textareas[i]).val(jQuery(my_textareas[i]).val());
  }

  return result;
};
})(jQuery.fn.clone);

(function($){
$.fn.inputDrag = function(options) {

    var settings = $.extend({
        min: 0,
        max: 2500
    }, options );

    var isDown = 0,
        el = $(this),
        negative = false,
        _xStart = 0,
        number = el.val().length ? el.val().replace(/[a-z\%]/g, "") : "",
        unit = el.val().length ? el.val().replace(/[0-9\-]/g, "") : "";

    var css_path = $(el).closest('.mfn-form-row').attr('data-csspath');
    var postfix = $(el).closest('.separated-fields').length ? $(el).attr('data-key') : '';
    var css_style = $(el).closest('.mfn-form-row').attr('data-name');
    var isLinked = false;
    var pseudo = false;

    var input_val = false;

    el.mousedown(function(e) {

        historyAllow = false;

        if( $(el).closest('.mfn-form-row').hasClass('margin') || el.closest('.mfn-form-row').hasClass('margin_tablet') || el.closest('.mfn-form-row').hasClass('margin_mobile') ){
            negative = true;
        }

        input_val = $(el).val();

        $(el).addClass('current');

        if( $(el).closest('.isLinked').length ) isLinked = true;
        if( $(el).closest('.pseudo').length ) pseudo = true;

        css_style = postfix != '' && !isLinked ? $(el).closest('.mfn-form-row').attr('data-name')+'-'+postfix : $(el).closest('.mfn-form-row').attr('data-name');

        if( unit == '' ) unit = 'px';

        isDown = 1;
        $('.sidebar-wrapper').addClass('mfn-vb-sidebar-overlay');
        var _x = event.clientX - number;
        _xStart = _x;

    });

    $(document).mouseup(function(e) {

        if( isDown ) {

            historyAllow = true;

            $('.sidebar-wrapper').removeClass('mfn-vb-sidebar-overlay');

            isDown = 0;


            if(!pseudo && el.hasClass('current')){
                if( $(el).val() !== input_val ) $(el).trigger('change');
                $(el).removeClass('current');
            }

            setTimeout(function() {
                $content.find(css_path).removeAttr('style');
            }, 100);

        }
    });

    $(document).mousemove(function(e) {

        if(!isDown)  return;
        var _x = event.clientX;

        if(_x && _x > 0) var _xDiff = _x - _xStart;

        if( !negative && _xDiff < settings.min ) _xDiff = settings.min;

        if( isDown == 1 && _x > 0 && ( negative || ( !negative && _xDiff >= settings.min ) ) ){

            if( isLinked ){
                $(el).closest('.isLinked').find('input').val(_xDiff+unit);
            }else{
                el.val(_xDiff+unit);
            }

            if( pseudo ){
                el.trigger('change');
            }else{

                if( css_style.includes('flex') ){
                    MfnVbApp.changeInlineStyles(css_path, css_style, '0 0 '+_xDiff+unit);
                    MfnVbApp.changeInlineStyles(css_path, 'max-width', _xDiff+unit);
                }else{
                    MfnVbApp.changeInlineStyles(css_path, css_style, _xDiff+unit);
                }

            }

        }

    });
};
}(jQuery));
