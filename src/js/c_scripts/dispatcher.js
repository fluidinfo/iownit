// 
//  dispatcher.js
//  crazy-fe
//  
//  Created by gregory tomlinson on 2011-01-11.
//  Copyright 2011 the public domain. All rights reserved.
//   Content Script
//
//
console.log("it's fluid");
(function(context) {
    var d=document, h=d.getElementsByTagName("head")[0], $=jQuery, local_store={};
    function find_meta() {
        // todo, use jquery
        // examine header element for meta tags, check for canonical too
        var meta_els = h.getElementsByTagName("meta"),
            link_els = h.getElementsByTagName("link"),
            meta_name, author, title, book_isbn;
        
        for(var i=0; i<meta_els.length; i++) {
            meta_name=meta_els[i].getAttribute("name");
            switch(meta_name) {
                case "author":
                    author=meta_els[i].getAttribute("content");
                break;
                    
                case "book_title":
                    title=meta_els[i].getAttribute("content");
                break;
                
                case "book.isbn":
                    book_isbn=meta_els[i].getAttribute("content");
                break;
            }
        }
        return [author, title, book_isbn]
    }
    
    function init() {
        var $author_els=$('.product-metadata .authorname'),
            $title = $("#title");
            // we use $var for convention, this is a jQuery wrapped element or set of elements
        
        var meta_checks=find_meta();
        if(meta_checks[0] && meta_checks[1]) {
            local_store.book_title=meta_checks[1];
            local_store.author=meta_checks[0];
            if(meta_checks.length>2) { local_store.book_isbn=meta_checks[2]; } 
            // var frag_struct={content : "fluid info here"}
            $(fastFrag.create(_draw_i_own_form())).insertAfter( $author_els.parents('dl') );
            // note, we mapped $ locally to jQuery
            $('#fluidinfo_iown_form input[type="radio"]').bind('change', function(e) {

                var radio_value = $(this).val();
                console.log("change event", e, radio_value);
                radio_value = parseInt( radio_value );
                local_store.ownit=radio_value;
                $('#fluidinfo_iown_form').replaceWith(fastFrag.create({
                    content : {
                        type : "a",
                        css : "fluidinfo_inline_box",
                        content : "Thanks for using fluidinfo",
                        attributes : {
                            href : "http://fluidinfo.com"
                        }
                    }
                }));  
                phone_background_script(function(jo) {
                    console.log("background", jo);
                })              
                 // if we wanted to display a box and get more information, we could, like so
                // if(radio_value) {
                //     console.log(radio_value, "open tag toast");
                //     document.body.appendChild( fastFrag.create( _draw_toastr() ) );

                // }
            });
        }
    }
    
    function phone_background_script( callback ) {
        var action_msg={
            action : 'add_iown',
            data : {
                book_title : local_store.book_title,
                author : local_store.author,
                ownit : local_store.ownit
            }
        }
        chrome.extension.sendRequest(action_msg, function(res) {
            console.log("background page says", res);
            callback(res);
        });
    }
    
    function _draw_toastr() {
        // 'toastie' or toast is TV slang for the little bubble and a reference to mortal combat i believe, where there was an easter egg
        // my comments are helpful ;)
        
        var stuct = {
            id : "fluid_info_toast",
            content : [{
                id : 'fluidinfo_toast_outer',
                content : {
                    id : 'fluidinfo_toast_inner',
                    content : [{
                        content : {
                            type : 'h1',
                            content : local_store.book_title + " (" + local_store.author + ")"
                        }
                    },{
                        content : {
                            type : 'form',
                            content : [{
                                type : "label",
                                content : "Add additional info",
                            },{
                                type : 'input',
                                attrs:{
                                    value:"",
                                    name:"fluidinfo_book_tag_input"
                                }
                                
                            }]
                        }
                    }]
                }
            },{
                id : 'fluidinfo_toast_bg',
                content : ''
            }]
        }
        return stuct;
        // fast frag structure, spelled wrong usually..
    }
    
    function _draw_i_own_form() {
        var stuct={
            type : 'form',
            css : "fluidinfo_inline_box",
            id : 'fluidinfo_iown_form',
            content : [{
                content : [{
                    type : "input",
                    id : "fluidinfo_iown_1",
                    attributes : {
                        type : "radio",
                        name : "fluidinfo_iown_book",
                        value : "1"     
                    }
                },{
                    type : "label",
                    id : "",
                    content : "I own it",                    
                    attrs : {
                        'for' : "fluidinfo_iown_1",     
                    }
                },{
                    content : [{
                        type : "input",
                        id : "fluidinfo_iown_2",
                        attrs : {
                            type : "radio",
                            name : "fluidinfo_iown_book",
                            value : "0"
                        }
                    },{
                        type : "label",
                        content : "Don't own it",
                        id : "some_name",
                        attrs : {
                            'for' : 'fluidinfo_iown_2'
                        }
                    }]
                },{
                    content : {
                        type : "a",
                        content : "fluidinfo, i own it",
                        attrs : {
                            href : "http://fluidinfo.com/"
                        }
                    }                    
                }]
            }]
        }; // end struct
        return stuct
    }
    
    init();
    
    
})(this);