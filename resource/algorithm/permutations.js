// 第一种
/*  
全排列（递归交换）算法  
1、将第一个位置分别放置各个不同的元素；  
2、对剩余的位置进行全排列（递归）；  
3、递归出口为只对一个元素进行全排列。  
*/

function swap(arr, i, j) {
	if (i != j) {
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
	}
}
var count = 0;
function show(arr) {
	document.write("P<sub>" + ++count + "</sub>: " + arr + "<br />");
}
function perm(arr) {
	(function fn(n) { //为第n个位置选择元素  
		for (var i = n; i < arr.length; i++) {
			swap(arr, i, n);
			if (n + 1 < arr.length - 1) //判断数组中剩余的待全排列的元素是否大于1个  
				fn(n + 1); //从第n+1个下标进行全排列  
			else
				show(arr); //显示一组结果  
			swap(arr, i, n);
		}
	})(0);
}
perm(["e1", "e2", "e3", "e4"]);


// 第二种
/*  
全排列（递归链接）算法  
1、设定源数组为输入数组，结果数组存放排列结果（初始化为空数组）；  
2、逐一将源数组的每个元素链接到结果数组中（生成新数组对象）；  
3、从原数组中删除被链接的元素（生成新数组对象）；  
4、将新的源数组和结果数组作为参数递归调用步骤2、3，直到源数组为空，则输出一个排列。  
*/

var count = 0;
function show(arr) {
	document.write("P<sub>" + ++count + "</sub>: " + arr + "<br />");
}
function perm(arr) {
	(function fn(source, result) {
		if (source.length == 0)
			show(result);
		else
			for (var i = 0; i < source.length; i++)
				fn(source.slice(0, i).concat(source.slice(i + 1)), result.concat(source[i]));
	})(arr, []);
}
perm(["e1", "e2", "e3", "e4"]);

/*  
全排列（递归回溯）算法  
1、建立位置数组，即对位置进行排列，排列成功后转换为元素的排列；  
2、建立递归函数，用来搜索第n个位置；  
3、第n个位置搜索方式与八皇后问题类似。  
*/
var count = 0;
function show(arr) {
	document.write("P<sub>" + ++count + "</sub>: " + arr + "<br />");
}
function seek(index, n) {
	if (n >= 0) //判断是否已回溯到了第一个位置之前，即已经找到了所有位置排列  
		if (index[n] < index.length - 1) { //还有下一个位置可选  
			index[n]++; //选择下一个位置  
			if ((function () { //该匿名函数判断该位置是否已经被选择过  
				for (var i = 0; i < n; i++)
					if (index[i] == index[n]) return true; //已选择  
				return false; //未选择  
			})())
				return seek(index, n); //重新找位置  
			else
				return true; //找到  
		}
		else { //当前无位置可选，进行递归回溯  
			index[n] = -1; //取消当前位置  
			if (seek(index, n - 1)) //继续找上一个位置  
				return seek(index, n); //重新找当前位置  
			else
				return false; //已无位置可选  
		}
	else
		return false;
}
function perm(arr) {
	var index = new Array(arr.length);
	for (var i = 0; i < index.length; i++)
		index[i] = -1; //初始化所有位置为-1，以便++后为0  
	for (i = 0; i < index.length - 1; i++)
		seek(index, i); //先搜索前n-1个位置  
	while (seek(index, index.length - 1)) { //不断搜索第n个位置，即找到所有位置排列  
		var temp = [];
		for (i = 0; i < index.length; i++) //将位置之转换为元素  
			temp.push(arr[index[i]]);
		show(temp);
	}
}
perm(["e1", "e2", "e3", "e4"]);

/*  
全排列（非递归回溯）算法  
1、建立位置数组，即对位置进行排列，排列成功后转换为元素的排列；  
2、第n个位置搜索方式与八皇后问题类似。  
*/
var count = 0;
function show(arr) {
	document.write("P<sub>" + ++count + "</sub>: " + arr + "<br />");
}
function seek(index, n) {
	var flag = false, m = n; //flag为找到位置排列的标志，m保存正在搜索哪个位置  
	do {
		index[n]++;
		if (index[n] == index.length) //已无位置可用  
			index[n--] = -1; //重置当前位置，回退到上一个位置  
		else if (!(function () {
			for (var i = 0; i < n; i++)
				if (index[i] == index[n]) return true;
			return false;
		})()) //该位置未被选择  
			if (m == n) //当前位置搜索完成  
				flag = true;
			else
				n++;
	} while (!flag && n >= 0)
	return flag;
}
function perm(arr) {
	var index = new Array(arr.length);
	for (var i = 0; i < index.length; i++)
		index[i] = -1;
	for (i = 0; i < index.length - 1; i++)
		seek(index, i);
	while (seek(index, index.length - 1)) {
		var temp = [];
		for (i = 0; i < index.length; i++)
			temp.push(arr[index[i]]);
		show(temp);
	}
}
perm(["e1", "e2", "e3", "e4"]);


/*  
全排列（非递归求顺序）算法  
1、建立位置数组，即对位置进行排列，排列成功后转换为元素的排列；  
2、按如下算法求全排列：  
设P是1～n(位置编号)的一个全排列：p = p1,p2...pn = p1,p2...pj-1,pj,pj+1...pk-1,pk,pk+1...pn  
(1)从排列的尾部开始，找出第一个比右边位置编号小的索引j（j从首部开始计算），即j = max{i | pi < pi+1}  
(2)在pj的右边的位置编号中，找出所有比pj大的位置编号中最小的位置编号的索引k，即 k = max{i | pi > pj}  
   pj右边的位置编号是从右至左递增的，因此k是所有大于pj的位置编号中索引最大的  
(3)交换pj与pk  
(4)再将pj+1...pk-1,pk,pk+1...pn翻转得到排列p' = p1,p2...pj-1,pj,pn...pk+1,pk,pk-1...pj+1  
(5)p'便是排列p的下一个排列  

例如：  
24310是位置编号0～4的一个排列，求它下一个排列的步骤如下：  
(1)从右至左找出排列中第一个比右边数字小的数字2；  
(2)在该数字后的数字中找出比2大的数中最小的一个3；  
(3)将2与3交换得到34210；  
(4)将原来2（当前3）后面的所有数字翻转，即翻转4210，得30124；  
(5)求得24310的下一个排列为30124。  
*/
var count = 0;
function show(arr) {
	document.write("P<sub>" + ++count + "</sub>: " + arr + "<br />");
}
function swap(arr, i, j) {
	var t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;

}
function sort(index) {
	for (var j = index.length - 2; j >= 0 && index[j] > index[j + 1]; j--)
		; //本循环从位置数组的末尾开始，找到第一个左边小于右边的位置，即j  
	if (j < 0) return false; //已完成全部排列  
	for (var k = index.length - 1; index[k] < index[j]; k--)
		; //本循环从位置数组的末尾开始，找到比j位置大的位置中最小的，即k  
	swap(index, j, k);
	for (j = j + 1, k = index.length - 1; j < k; j++ , k--)
		swap(index, j, k); //本循环翻转j+1到末尾的所有位置  
	return true;
}
function perm(arr) {
	var index = new Array(arr.length);
	for (var i = 0; i < index.length; i++)
		index[i] = i;
	do {
		var temp = [];
		for (i = 0; i < index.length; i++)
			temp.push(arr[index[i]]);
		show(temp);
	} while (sort(index));
}
perm(["e1", "e2", "e3", "e4"]);


/*  
全排列（非递归求模）算法  
1、初始化存放全排列结果的数组result，与原数组的元素个数相等；  
2、计算n个元素全排列的总数，即n!；  
3、从>=0的任意整数开始循环n!次，每次累加1，记为index；  
4、取第1个元素arr[0]，求1进制的表达最低位，即求index模1的值w，将第1个元素（arr[0]）插入result的w位置，并将index迭代为index\1；  
5、取第2个元素arr[1]，求2进制的表达最低位，即求index模2的值w，将第2个元素（arr[1]）插入result的w位置，并将index迭代为index\2；  
6、取第3个元素arr[2]，求3进制的表达最低位，即求index模3的值w，将第3个元素（arr[2]）插入result的w位置，并将index迭代为index\3；  
7、……  
8、直到取最后一个元素arr[arr.length-1]，此时求得一个排列；  
9、当index循环完成，便求得所有排列。  

例：  
求4个元素["a", "b", "c", "d"]的全排列, 共循环4!=24次，可从任意>=0的整数index开始循环，每次累加1，直到循环完index+23后结束；  
假设index=13（或13+24，13+2*24，13+3*24…），因为共4个元素，故迭代4次，则得到的这一个排列的过程为：  
第1次迭代，13/1，商=13，余数=0，故第1个元素插入第0个位置（即下标为0），得["a"]；  
第2次迭代，13/2, 商=6，余数=1，故第2个元素插入第1个位置（即下标为1），得["a", "b"]；  
第3次迭代，6/3, 商=2，余数=0，故第3个元素插入第0个位置（即下标为0），得["c", "a", "b"]；  
第4次迭代，2/4，商=0，余数=2, 故第4个元素插入第2个位置（即下标为2），得["c", "a", "d", "b"]；  
*/
var count = 0;
function show(arr) {
	document.write("P<sub>" + ++count + "</sub>: " + arr + "<br />");
}
function perm(arr) {
	var result = new Array(arr.length);
	var fac = 1;
	for (var i = 2; i <= arr.length; i++)
		fac *= i;
	for (index = 0; index < fac; index++) {
		var t = index;
		for (i = 1; i <= arr.length; i++) {
			var w = t % i;
			for (j = i - 1; j > w; j--)
				result[j] = result[j - 1];
			result[w] = arr[i - 1];
			t = Math.floor(t / i);
		}
		show(result);
	}
}
perm(["e1", "e2", "e3", "e4"]);


function permAlone(str) {

	var regex = /(.)\1+/g;

	var permutate = function (str) {

		var result = [];
		if (str.length == 1) {
			return [str];
		} else {

			var preResult = permutate(str.slice(1));
			for (var j = 0; j < preResult.length; j++) {
				for (var k = 0; k < preResult[j].length + 1; k++) {
					var temp = preResult[j].slice(0, k) + str[0] + preResult[j].slice(k);
					result.push(temp);

				}
			}

			return result;
		}
	};

	var permutations = permutate(str);


	var filtered = permutations.filter(function (string) {
		return !string.match(regex);
	});


	return filtered.length;
}
