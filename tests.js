// QUnit.test( "hello test", function( assert ) {
//     assert.ok( 1 == "1", "Passed!" );
// });

QUnit.test( "noten.parseNote", function( assert ) {
    assert.equal(noten.parseNote(""),null);
    assert.equal(noten.parseNote("1.3"),1.3);
    assert.equal(noten.parseNote(1.3),1.3);
    assert.equal(noten.parseNote(5),5);
    assert.equal(noten.parseNote("2+"),1.75);
    assert.equal(noten.parseNote("5-"),5.25);
    assert.equal(noten.parseNote("3-4"),3.5);
    assert.equal(noten.parseNote("3-5"),null);
    assert.equal(noten.parseNote("8+"),null);
});

QUnit.test( "noten.isEmptyCol", function( assert ) {
    let data = [[0,1,2,'',4],
    [0,1,2,'',4],
    [0,1,2,'',4]];
    assert.equal(noten.isEmptyCol(data,3),true);
    data[2][3]='x';
    assert.equal(noten.isEmptyCol(data,3),false);
    data[0][3]=6;
    assert.equal(noten.isEmptyCol(data,3),false);
});

getData = () => {
    return [[0,1,2,'',4],
            [0,1,2,'',4],
            [0,1,2,'',4]];
}

QUnit.test( "noten.addEmptyColIfNeeded", function( assert ) {
    let data = getData();
    noten.addEmptyColIfNeeded(data);
    assert.equal(data[0].length,5);

    data = getData();
    data[0][3]='x';
    noten.addEmptyColIfNeeded(data);
    assert.equal(data[0].length,6);
    assert.ok(noten.isEmptyCol(data,4));

    data = getData();
    data[2][3]=5;
    noten.addEmptyColIfNeeded(data);
    assert.equal(data[0].length,6);
    assert.ok(noten.isEmptyCol(data,4));
});