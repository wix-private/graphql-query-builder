var expect = require('chai').expect;
var GraphQlQuery: gql.GraphQlQueryFactory = require('../src/GraphQlQuery');


describe('GraphQL Query Builder', () => {
	describe('product', () => {
		it('should include product', () => {
			const query = new GraphQlQuery('product');
			expect(query.toString()).to.equal('{ product{} }');
		});

		it('should support alias for product', () => {
			const query = new GraphQlQuery({alias: 'product'});
			expect(query.toString()).to.equal('{ alias: product{} }');
		});

		it('should support arguments for product', () => {
			const query = new GraphQlQuery({alias: 'product'}, {attr1: 'value1', attr2: 2, attr3: true});
			expect(query.toString()).to.equal('{ alias: product(attr1: "value1", attr2: 2, attr3: true){} }');
		});
	});

	describe('select', () => {
		it('should support fields selection', () => {
			const query = new GraphQlQuery('product')
				.select('id', 'name');
			expect(query.toString()).to.equal('{ product{id name} }');
		});

		it('should support fields selection with alias', () => {
			const query = new GraphQlQuery('product')
				.select({productId: 'id'}, 'name', {price: 'productPrice'});
			expect(query.toString()).to.equal('{ product{productId: id name price: productPrice} }');
		});

		it('should support fields selection with arguments', () => {
			const query = new GraphQlQuery('product')
				.select({productId: 'id'}, 'name', {price: 'productPrice', _filter: {discounted: true}});
			expect(query.toString()).to.equal('{ product{productId: id name price: productPrice(discounted: true)} }');
		});

		it('should support selection of a Query', () => {
			const mainMedia = new GraphQlQuery('media').select('url');
			const product = new GraphQlQuery('product', {productId: 'f150b16a-79ef-ef81-50f9-22e2df631822'})
				.select('id', 'name', mainMedia);
			expect(product.toString()).to
				.equal('{ product(productId: "f150b16a-79ef-ef81-50f9-22e2df631822"){id name media{url}} }');
		});

		it('should support selection of a Query with alias', () => {
			const mainMedia = new GraphQlQuery('media').select('url');
			const product = new GraphQlQuery('product', {productId: 'f150b16a-79ef-ef81-50f9-22e2df631822'})
				.select('id', 'name', {image: mainMedia});
			expect(product.toString()).to
				.equal('{ product(productId: "f150b16a-79ef-ef81-50f9-22e2df631822"){id name image: media{url}} }');
		});
	});

	describe('join', () => {
		it('should support joining 2 queries', () => {
			const mainMedia = new GraphQlQuery('media').select('url');

			const query1 = new GraphQlQuery('product')
				.select({productId: 'id'}, 'name', {price: 'productPrice', _filter: {discounted: true}});
			const query2 = new GraphQlQuery('order')
				.select('id', {totalValue: 'total'});

			const finalQuery = query1.join(query2);
			expect(finalQuery.toString()).to
				.equal('{ product{productId: id name price: productPrice(discounted: true)} order{id totalValue: total} }');
		});

		it('should throw exception when selecting on join query', () => {
			const query1 = new GraphQlQuery('product')
				.select({productId: 'id'}, 'name', {price: 'productPrice', _filter: {discounted: true}});
			const query2 = new GraphQlQuery('order')
				.select('id', {totalValue: 'total'});
			const finalQuery = query1.join(query2);
			expect(finalQuery.select.bind(finalQuery, '1')).to.throw(Error);
		});
	});
});

