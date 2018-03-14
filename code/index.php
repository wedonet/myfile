				<a href="{{$cc}}/{{$v->id}}/edit" title="">
				 编辑
				</a>
			

				<a href="{{$cc}}/{{$v->id}}" class="j_del" title="删除{{$v->title}}" data-title1="名称" data-title2="{{$v->title}}" data-title3="部门">
				 删除
				</a>
<?php

class huodongController extends Controller {
    private $parent;
    private $viewfolder;
    private $dbname;

    function __construct() {
        $this->oj = (object)[];
        
        $this->currentcontroller = '/adminconsole/huodong'; //控制器
        $this->viewfolder = 'admin.huodong'; //视图路径
        $this->dbname = 'activity';

        $this->oj->nav = 'huodong';
        $this->oj->currentcontroller = $this->currentcontroller;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $search = (object)[];
        
        $rules = array(
            'title' => 'string|between:1,20'
        );

        $attributes = array(
            "title" => '活动名称'
        );

        $message = array(
        );

        $validator = Validator::make(
                        $request->all(), $rules, $message, $attributes
        );

        if ($validator->fails()) {
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }

        $search->title = $request->title;

        $search->currentstatus = $request->currentstatus;

        $this->oj->search = $search;




        $list = DB::table($this->dbname)
                ->where('isdel', 0)
                ->where(function($query) use($search) {
                    if ('' != $search->title) {
                        $query->where('title', 'like', '%' . $search->title . '%');
                    }
                    if ('' != $search->currentstatus) {
                        $query->where('currentstatus', '=', $search->currentstatus);
                    }
                })
                ->orderby('id', 'desc')
                ->paginate(20);

        $this->oj->list = $list;




        return view($this->viewfolder . '.index', ['oj' => $this->oj]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create() {
        return view($this->viewfolder . '.create', ['j' => $this->j]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {

        return redirect($this->currentcontroller);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $data = DB::table($this->dbname)
                ->where('id', $id)
                ->first();
   
        
        $department = app('main')->getdepartmentbyteacherbycode($data->sucode);

        if($department){
            $this->oj->department = $department;
        }

        $this->oj->data = $data;

        return view($this->viewfolder . '.detail', ['oj' => $this->oj]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id) {
        $data = DB::table($this->dbname)
                ->where('id', $id)
                ->first();

        $this->j['data'] = $data;

        return view($this->viewfolder . '.edit', ['j' => $this->j]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        $rules = array(
            'title' => 'alpha_num|between:1,20',
            'readme' => 'alpha_num|between:1,255',
            'cls' => 'integer'
        );

        $attributes = array(
            "title" => '名称',
            'readme' => '简介',
            'cls' => '排序'
        );

        $validator = Validator::make(
                        $request->all(), $rules, array(), $attributes
        );

        if ($validator->fails()) {
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }

        /**/

        $rs['title'] = $request->title;
        $rs['readme'] = $request->readme;
        $rs['cls'] = $request->cls;



        DB::table($this->dbname)->where('id', $id)->update($rs);

        $suctip[] = '<a href="' . $this->currentcontroller . '">返回部门管理</a>';
        return ( app('main')->jssuccess('操作成功', $suctip));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {

        DB::beginTransaction();
        try {
            $deleteic = DB::table($this->dbname)
                    ->where('id', $id)
                    ->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            throw $e;
        }

        return redirect()->back()->withInput()->withSuccess('删除成功！');
    }

    public function export() {
        require_once(base_path() . '/resources/views/init.blade.php');

        $data = DB::table($this->dbname)
                ->get();

        $head = array(
            '名称',
            '活动学年',
            '一级活动类型',
            '二级活动类型',
            '活动级别',
            /**/
            '活动时长',
            '活动开始时间',
            '活动结束时间',
            '活动报名开始时间',
            '活动报名结束时间',
            /**/
            '主办单位',
            '活动地点',
            '活动介绍',
            '是否需要提交作业',
            '提交作业开始时间',
            /**/
            '提交作业结止时间',
            '报名方式',
            '报名人数限制',
            '备注',
            '附件路径',
            /**/
            '联系人',
            '联系电话'
        );

        $list[0] = $head;






        foreach ($data as $v) {
            unset($rs);
            $rs['title'] = $v->title;
            $rs['activity_year'] = $v->activity_year;
            $rs['type_onename'] = $v->type_onename;
            $rs['type_twoname'] = $v->type_twoname;
            $rs['mylevel'] = activitylevel($v->mylevel);
            /**/
            $rs['mytimelong'] = $v->mytimelong;
            $rs['plantime_one'] = formattime2($v->plantime_one);
            $rs['plantime_two'] = formattime2($v->plantime_two);
            $rs['signuptime_one'] = formattime2($v->signuptime_one);
            $rs['signuptime_two'] = formattime2($v->signuptime_two);
            /**/
            $rs['sponsor'] = $v->sponsor;
            $rs['myplace'] = $v->myplace;
            $rs['readme'] = $v->readme;
            $rs['homework'] = y01($v->homework);
            $rs['homeworktime_one'] = formattime2($v->homeworktime_one);
            /**/
            $rs['homeworktime_two'] = formattime2($v->homeworktime_two);
            $rs['mywayic'] = signupmethod($v->mywayic);
            $rs['signlimit'] = $v->signlimit;
            $rs['other'] = $v->other;
            $rs['attachmentsurl'] = $v->attachmentsurl;
            /**/
            $rs['conname'] = $v->conname;
            $rs['contel'] = $v->contel;


            $list[] = $rs;
        }


        Excel::create('活动表', function($excel) use ($list) {
            $excel->sheet('score', function($sheet) use ($list) {
                $sheet->rows($list);
            });
        })->export('xls');
    }

}
				
?>