require(base_path().'/resources/views/init.blade.php');

composer dump-autoload

{{ csrf_field() }}

date("Y-m-d H:i:s", $time);

{{$_SERVER['REQUEST_URI'] }}  //来时的链接，用于把url用做form action


//index
 $rules = array(
            'title' => 'alpha_num|between:1,20',
            'mycode' => 'alpha_num|between:1,20'
        );

        $attributes = array(
            "title" => '班级名称',
            'mycode' => '班级号'
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
        $search->mycode = $request->mycode;
        
        $this->oj->search = $search;

        
        
        $list = DB::table($this->dbname)
                ->where('isdel', 0)
                ->where(function($query) use($search) {
                    if ('' != $search->title ) {
                        $query->where('title', 'like', '%'.$search->title.'%');
                    }
                    if ('' != $search->mycode ) {
                        $query->where('mycode', 'like', '%'.$search->mycode.'%');
                    }                    
                    
                })                
                ->orderby('cls', 'asc')
                ->orderby('id', 'asc')
                ->get();

        $this->oj->list = $list;

        return view($this->viewfolder . '.index', ['oj' => $this->oj]);




//选择
        $data = DB::table($this->dbname)
                ->where('id', $id)
                ->first();

        $this->j['data'] = $data;


        $json['suc'] = 'n';        
        $json['err'] = 'dddddde';
        $json['info'] = 'dddddde'; //成功提示信息
        $json['url'] = ''; //成功后跳转到的网址
        $json['reload'] = 'y';
        
        
        
        echo json_encode($json, 320);


//入库操作
   $rules = array(
            'title' => 'required|string|between:1,50',
            'avtivity_year' => 'required|integer|between:2000,2090',
            'type_oneic' => 'required|string|between:1,20',            
            'plantime_one' => 'required|date',            
            'sponsor' => 'required|string|between:1,20',           
            'homework' => 'required|in:0,1',
            'homeworktime_one' => 'required_if:homework,1|date',
            'other' => 'string|between:1,255',
        );

        $attributes = array(
            'title' => '名称'          
        );

        $validator = Validator::make(
                        $request->all(), $rules, array(), $attributes
        );

        if ($validator->fails()) {
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }

      
        /**/
        $time = time();
        $date = date("Y-m-d H:i:s", $time);

        $rs['ic'] = app('main')->getfirstic();

        $rs['title'] = $request->title;     


        $rs['created_at'] = $date;

        if (DB::table($this->dbname)->insert($rs)) {
            $suctip[] = '<a href = "' . $this->currentcontroller . '">返回活动管理</a>';
            return ( app('main')->jssuccess('保存成功', $suctip));
        } else {
            $validator->errors()->add('error', '保存失败');
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }


//更新操作

   $rs['created_at'] = $date;


   DB::table($this->dbname)->where('id', $id)->update($rs);

//更新统计

       DB::table('activity')
                ->where('id', $activity->id)
                ->increment('signcount');


可以用->toSql()方法查看执行的sql语句，方便调试。



with('sucinfo', '操作成功！');


http://localhost:1620/signin/81100100273087256





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


/*另一种事务处理方式*/

                           DB::transaction(function () use ($codeslist) {
                        foreach ($codeslist as $v) {
                            DB::statement($v);
                        }
                    });


致命错误处理
return redirect('/showerr')->with('errmessage','出错了');            

return redirect()->back()->withInput()->withErrors(($validator->errors()->toArray()));

return redirect()->back()->withInput()->with('sucinfo', '操作成功！');

return view('common.jopen')->withErrors(($validator->errors()->toArray()));

return ( app('main')->ajaxvali($validator->errors()->toArray()) );

php artisan config:cache


[html] view plain copy

    php artisan cache:clear  
    php artisan config:clear 


//分页

        $list->appends(['aid' => $activityid])
                ->appends(object_to_array($search))
                ->links();
                
 ->paginate(18);

<center>{!! $list->render() !!}</center>
<center>{!! $list->appends(object_to_array($oj->search))->render() !!}</center>

<input type="checkbox" class="blankCheckbox" value="option1" id="contrasel" aria-label="...">
<input type="checkbox" class="blankCheckbox"  name="ids[]" value="{{$v->id}}" aria-label="...">



         $rules = array(
            'ids' => 'required|array'
        );

        $attributes = array(
            'ids' => '记录'
        );

        $validator = Validator::make(
                        $request->all(), $rules, array(), $attributes
        );

        if ($validator->fails()) {
            return redirect()->back()->withErrors(($validator->errors()->toArray()));
            //return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }

j_epen 前出错 
return view('common.jopen')->withErrors(($validator->errors()->toArray()));                


$this->oj = (object)array_merge((array)$this->oj, (array)$request->oj);


/*查看哪些二级分类是我这个部门的*/
app('main')->getMyactivityTypeList($_ENV['user']['dic']);


在composer.json加完自定义函数后执行
composer dump-auto


//查看执行的sql
DB::enableQueryLog(); 
        $list = DB::table($this->dbname)
                ->paginate(18);
      
dd(DB::getQueryLog()); 



php artisan config:clear
composer dump-autoload