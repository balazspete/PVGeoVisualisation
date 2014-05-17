
window.TITLE = 'PV GeoVisualisation';
var endpoint = "";

window.TEMPLATES = {};
Handlebars.registerHelper('render', function(context, options) {
	var _options = window.queryOptions[context.type] || {};
	return new Handlebars.SafeString(window.TEMPLATES[context.type + '-template'](_.extend(context, _options)));
});

Handlebars.registerHelper('idfy', function(context, options) {
	return 'queryvalue-' + context.replace(/\./g, '-');
});

function getTagCloudTag(context, active) {
	var model = {value: context, active: active || false};
	return window.TEMPLATES['tag-cloud-tag-template'](model);
}

Handlebars.registerHelper('tagCloudTag', function(context, options) {
	return new Handlebars.SafeString(getTagCloudTag(context));
});

Handlebars.registerHelper('getQueryValue', function(context, options) {
	var attrs = context.split('.');
	var element = window.queryOptions, i;

	for(i = 0; i < attrs.length; i++) {
		element = element[attrs[i]];
		if (!element) {
			return '';
		}
	}

	return element;
});

function setupHandlebars() {
	_.each($('.template'), function(template) {
		if (!template) { return; }
		var id = $(template).attr('id');
		var html = $(template).html();

		window.TEMPLATES[id] = Handlebars.compile(html);
	});
};

function createQuery(callback) {
	window.queryOptions = _.extend({
		limit: 		5000
	}, window.queryOptions);

	var getQuery = function(cb) {
		$.ajax('assets/query', {
			type: 		'GET',
			dataType: 	'text',
			success: function (data) {
				cb(null, Handlebars.compile(data));
			},
			error: function (jqXHR, textStatus, errorThrown) {
				cb(true);
			}
		});
	}

	if (window.QUERY) {
		callback(null, window.QUERY(window.queryOptions));	
	} else {
		getQuery(function(err, template) {
			if (err) {
				return callback(err);
			}

			window.QUERY = template;
			callback(null, window.QUERY(window.queryOptions));	
		});
	}
}

function getUrlVars() {
    var vars = {}, hash;

    var split = window.location.href.indexOf('?');

    if (split >= 0) {
	    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	    
	    _.each(hashes, function(hash) {
	    	var _hash = hash.split('=');
	    	if (_hash.length && _hash[0]) {
		    	vars[_hash[0]] = _hash[1];
		    }
	    });
	}

    return vars;
}

function processUrlVars(vars) {
	var _vars = vars, result = {};

	_.each(_vars, function(element, key) {
		if (_.str.include(element, '|')) {
			var i = element.length-1;
			if (element[i] == '|') {
				element = element.substring(0, i);
			}
			vars[key] = element.split('|');
		}
	});

	var process;
	process = function(object, keys, data) {
		if (!keys.length) {
			return data;
		}

		var key = keys.shift();
		object[key] = process(object[key] || {}, keys, data);
		return object;
	};

	_.each(vars, function(element, key) {
		var keys = key.split('.');
		process(result, keys, element);
	});

	return result;
}

function getQueryOptions() {
	var vars = getUrlVars();
	var options = processUrlVars(vars);
	return options;
}

function renderQueryUI(callback) {
	var loadStructure = function(cb) {
		$.ajax('assets/interface.json', {
			type: 		'GET',
			dataType: 	'json',
			success: function (data) {
				cb(null, data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				cb(errorThrown);
			}
		});
	}

	if (!window.QUERYSTRUCTURE) {
		return loadStructure(function(err, data) {
			if (err) {
				return console.error(err);
			}

			window.QUERYSTRUCTURE = data;
			renderQueryUI(callback);
		});
	}

	var html = window.TEMPLATES['query-ui-template'](window.QUERYSTRUCTURE);
	$('#query-ui')[0].innerHTML = html;
	callback(null);
}

function tagCloudify() {
	var addElement = function(parent, text) {
		newQuery(text, parent.data('query-id'), true);
	}

	$('.query-selector.tag-cloud button').click(function(event) {
		var parent = $($(this).parents('.tag-cloud')[0]);
		var element = $(parent.find('input'));
		var text = element.val();
		element.val('');

		addElement(parent, text);
	});

	$('.query-selector.tag-cloud input.form-control').keypress(function(event) {
		var key = event.keyCode ? event.keyCode : event.which;
		if (key == 13) {
			var parent = $($(this).parents('.tag-cloud')[0]);
			var text = $(this).val();
			$(this).val('');

			addElement(parent, text);
		}
	});

	$('.tag-cloud-tag.label-default').click(function(event) {
		event.preventDefault();
		var parent = $($(this).parents('.tag-cloud')[0]);
		addElement(parent, $(this).data('value'));
		return true;
	});

}

function selectify() {
	var callback = function(element, event) {
		var parent = $($(element).parents('.query-selector')[0]);
		var id = parent.data('query-id');
		newQuery($(parent).find('input').val(), id);
	};

	$('.query-selector.single button').click(function(event){
		callback(this, event)
	});
	$('.query-selector.single input.form-control').keypress(function(event){
		var key = event.keyCode ? event.keyCode : event.which;
		if (key == 13) {
			callback(this, event);
		}
	});
}

function newQuery(value, key, push) {
	if (!key) {
		return;
	}

	var query = getUrlVars();
	if (push) {
		var val = query[key] || '';
		if(_.str.include(val, value)) {
			return;
		}

		query[key] = val + value + '|';
	} else {
		if (query[key] == value) {
			return;
		}

		query[key] = value;
	}

	var _query = [];
	_.each(query, function(element, key) {
		if(element) {
			_query.push(key + "=" + element);
		}
	});

	History.pushState(null, window.TITLE, '/?' + _query.join('&'));
	updateInterface();
}

function addActiveTags() {
	var addTag = function(element, value) {
		var tag = element.find('.tag-cloud-tag[data-value="'+value+'"]')[0];
		if (tag) {
			$(tag).removeClass('label-default').addClass('label-primary');
		} else {
			console.log('tag', getTagCloudTag(value, true));
			element.append(getTagCloudTag(value, true));
		}
	};

	var removeElement = function(parent, text) {
		var key = parent.data('query-id');
		var value = getUrlVars()[key];
		value = value.replace(text + "|", "");
		value = value.replace(text, "");
		console.log(value);
		newQuery(value, key);
	};

	$('.tag-cloud-area').each(function(index, element) {
		var e = $(element);
		var value = queryOptions[e.attr('data-query-id').split('.')[0]];
		if (value) {
			var addTags = function(value) {
				if (_.isArray(value)) {
					_.each(value, function(data) {
						addTag(e, data);
					});
					return true;
				}
				return false;
			}

			var added = addTags(value);
			if(!added) {
				console.log('v', value.values);
				addTags(value.values);
			}
		}
	});

	$('.tag-cloud-tag.label-primary').click(function(event) {
		event.preventDefault();
		var parent = $($(this).parents('.tag-cloud')[0]);
		removeElement(parent, $(this).data('value'));
		return true;
	});
}

function updateInterface() {
	window.queryOptions = getQueryOptions();
	createQuery(function(err, query) {
		console.log(query);
		$('#visualisation').attr('data-sgvizler-query', query);
		sgvizler.containerDrawAll(); 
	});
	renderQueryUI(function(err) {
		$('a.tab-switch-link').click(function(event) {
			event.preventDefault();
			$(this).tab('show');
			return true;
		});
		tagCloudify();
		selectify();
        setupClearQueryElement();
        addActiveTags();
        $('[data-toggle="tooltip"]').tooltip();
	});
}

function setupClearQueryElement() {
	$('.query-selector button.clear-link').click(function(event){
		event.preventDefault();
		var parent = $($(this).parents('.query-selector'));
		newQuery(null, parent.data('query-id'));
		return true;
	});
}





