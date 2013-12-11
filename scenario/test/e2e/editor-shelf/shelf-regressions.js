'use strict';
var ShelfHelper = require('../../lib/shelf-helper.js').ShelfHelper;
var AssertsHelper = require ('../../lib/asserts-helper.js').AssertsHelper;
var EditorHelper = require ('../../lib/editor-helper.js').EditorHelper;
describe('shelf',function(){
  var  shelf = new ShelfHelper();
  var designerAsserts = new AssertsHelper();
  var editor = new EditorHelper();

  beforeEach(function(){
    editor.setValue('');
    expect(editor.getLine(1)).toEqual('');
    designerAsserts.shelfElements(shelf.elemRamlVersion);
    expect(editor.noErrorIsDisplayed()).toBe(false);
  });

  describe('elements',function(){

    it('added below on an array', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - hola:',
        '      trace: \\n      '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(6,0);
      shelf.getElements().then(function(list){
        list[0].click();
      });
      expect(editor.getLine(6)).toEqual('version: v0.1');
    });

    it('add in a line with blanks at the end', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        '/res:',
        '  options: \\n        '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(5,2);
      shelf.getElements().then(function(list){
        list[0].click();
      });
      expect(editor.getLine(5)).toEqual('  displayName:');
    });

    it('are added below', function(){
      editor.setCursor(1,0);
      var lista = ['#%RAML 0.8','title: My API','version: v0.1','schemas:','baseUri: http://server/api/{version}',
        'mediaType:','protocols:','documentation:','baseUriParameters:','securitySchemes:','securedBy:','/newResource:',
        '  displayName: resourceName','  description:','  options:','    description: <<insert text or markdown here>>',
        '    protocols:','    baseUriParameters:','    headers:','    queryParameters:','    responses:',
        '    securedBy:','    is:','    body:'];
      var i=1;
      var promise;
      lista.forEach(function(elem){
        var t = i++;
        if (elem === '  displayName: resourceName' || elem === '    description: <<insert text or markdown here>>'){
          expect(editor.getLine(t)).toEqual(elem);
          t++;
        }else{
          promise = shelf.selectFirstElem();
          promise.then(function(){
            expect(editor.getLine(t)).toEqual(elem);
            t++;
          });
        }
      });
    });

    it('root level - some lines with indent below', function(){
      var definition = [
        '#%RAML 0.8',
        'title: hola',
        'resourceTypes:',
        '  - hola: ',
        '      options:',
        '        description: <<insert text or markdown here>>',
        ' ',
        '  ',
        '  ',
        '  '
      ].join('\\n');
      editor.setValue(definition);
      editor.setCursor(7,0);
      var promise = shelf.selectFirstElem();
      promise.then(function(){
        expect(editor.getLine(7)).toEqual('version: v0.1');
      });
    });

  });// adding elements from shelf

}); // Shelf

