/* 
*   A really small POC
*/

import $ from 'jquery';
import { compile } from 'handlebars';
import { api as mgnifyApi } from 'mgnify';

/* MGnfy API */
const API_URL = 'https://www.ebi.ac.uk/metagenomics/api/v1/';

const api = mgnifyApi({
    'API_URL': API_URL
});

const app = {};

const getCollectionURl = (accession) => {
    return API_URL + 'analyses/' + accession + '/go-slim'; 
};

/* GO Slim collection */
const GoSlimCollection = Backbone.Collection.extend({
    model: api.GoSlim,
    parse(response) {
        return response.data;
    }
});

/* Views */
const GoSlimView = Backbone.View.extend({
    tagName: 'tr',
    model: api.GoSlim,
    template: compile(document.getElementById('go-slim-item-tpl').innerHTML),

    render() {
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
        return this;        
    }
});

const GoSlimListView = Backbone.View.extend({
    el: '#go-slim-view',

    events: {
        'submit': 'onFilter'
    },  

    initialize: function() {
        this.listenTo(this.collection, 'sync', this.render);
    },

    render() {
        let $list = $('#go-slim-list').empty();
        if (this.collection.length === 0) {
            $list.append('No data ...');
        } else {
            // TODO move this to a template
            $list.append('<tr><th>Accession</th><th>Description</th></tr>');
            this.collection.each((model) => {
                if (model.get('show') !== false) {
                    $list.append(new GoSlimView({model: model}).render().$el);
                }
            }, this);
        }
        return this;
    },
    
    onFilter(e) {
        e.preventDefault();
        const filter = $('.filter', this.$el).val();
        this.collection.each((m) => {
            m.set('show', m.get('attributes').description.indexOf(filter) > -1);
        }, this);

        // This is not efficient... at all.
        this.render();
    }
});

/* APP setup and main view */
app.goCollection = new GoSlimCollection();
app.goSlimListView = new GoSlimListView({collection: app.goCollection});

/* Search View */
const SearchView = Backbone.View.extend({
    el: '#search-view',

    events: {
        'submit': 'onSearch'
    },

    onSearch(e) {
        e.preventDefault();
        $('.message').empty();
        const acc = $('.search', this.$el).val();
        app.goCollection.url = getCollectionURl(acc);
        app.goCollection.fetch().catch(() => {
            $('.message', this.$el).html('<span class="tag is-danger">Error :(</span>');
        });
    }
});

app.searchView = new SearchView();