/*let baseRange = 
	[
		[230, 124, 115], //RED,    lowest value
		[255, 214, 102], //ORANGE, median
		[87,  187, 138]  //GREEN,  heighest value
	]*/
let baseRange = 
	[
		[145, 26,  8  ], //RED,    lowest value
		[221, 144, 11 ], //ORANGE, median
		[20,  145, 8  ]  //GREEN,  heighest value
	]

class ColourRange {
	constructor(range=baseRange) {
		this.range = range;
	}

	findColour(value, dataset) {
		if (dataset.indexOf(value)==-1) return false;

		let valuePercentile = dataset.sort((a,b)=>{return a-b}).indexOf(value)/(dataset.length-1);
		
		if (valuePercentile==1) {
			return this.range[2];
		} else if (valuePercentile==0) {
			return this.range[0];
		} else if (valuePercentile==0.5) {
			return this.range[1];
		} else if (valuePercentile<0.5) {
			var pos = valuePercentile*2;
			return  [
						(this.range[0][0]+this.range[1][0])*pos,
						(this.range[0][1]+this.range[1][1])*pos,
						(this.range[0][2]+this.range[1][2])*pos
				    ];
		} else if (valuePercentile>0.5) {
			var pos = (valuePercentile*2)-1;
			return  [
						(this.range[1][0]+this.range[2][0])*pos,
						(this.range[1][1]+this.range[2][1])*pos,
						(this.range[1][2]+this.range[2][2])*pos
				    ];
		}
		return false;
	}
}

module.exports = ColourRange;
