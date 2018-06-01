require(base_path().'/resources/views/init.blade.php');

composer dump-autoload

{{ csrf_field() }}

date("Y-m-d H:i:s", $time);

{{$_SERVER['REQUEST_URI'] }}  //��ʱ�����ӣ����ڰ�url����form action


//index
 $rules = array(
            'title' => 'alpha_num|between:1,20',
            'mycode' => 'alpha_num|between:1,20'
        );

        $attributes = array(
            "title" => '�༶����',
            'mycode' => '�༶��'
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




//ѡ��
        $data = DB::table($this->dbname)
                ->where('id', $id)
                ->first();

        $this->j['data'] = $data;


        $json['suc'] = 'n';        
        $json['err'] = 'dddddde';
        $json['info'] = 'dddddde'; //�ɹ���ʾ��Ϣ
        $json['url'] = ''; //�ɹ�����ת������ַ
        $json['reload'] = 'y';
        
        
        
        echo json_encode($json, 320);


//������
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
            'title' => '����'          
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
            $suctip[] = '<a href = "' . $this->currentcontroller . '">���ػ����</a>';
            return ( app('main')->jssuccess('����ɹ�', $suctip));
        } else {
            $validator->errors()->add('error', '����ʧ��');
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }


//���²���

   $rs['created_at'] = $date;


   DB::table($this->dbname)->where('id', $id)->update($rs);

//����ͳ��

       DB::table('activity')
                ->where('id', $activity->id)
                ->increment('signcount');


������->toSql()�����鿴ִ�е�sql��䣬������ԡ�



with('sucinfo', '�����ɹ���');


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


/*��һ��������ʽ*/

                           DB::transaction(function () use ($codeslist) {
                        foreach ($codeslist as $v) {
                            DB::statement($v);
                        }
                    });


����������
return redirect('/showerr')->with('errmessage','������');            

return redirect()->back()->withInput()->withErrors(($validator->errors()->toArray()));

return redirect()->back()->withInput()->with('sucinfo', '�����ɹ���');

return view('common.jopen')->withErrors(($validator->errors()->toArray()));

return ( app('main')->ajaxvali($validator->errors()->toArray()) );

php artisan config:cache


[html] view plain copy

    php artisan cache:clear  
    php artisan config:clear 


//��ҳ

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
            'ids' => '��¼'
        );

        $validator = Validator::make(
                        $request->all(), $rules, array(), $attributes
        );

        if ($validator->fails()) {
            return redirect()->back()->withErrors(($validator->errors()->toArray()));
            //return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }

j_epen ǰ���� 
return view('common.jopen')->withErrors(($validator->errors()->toArray()));                


$this->oj = (object)array_merge((array)$this->oj, (array)$request->oj);


/*�鿴��Щ������������������ŵ�*/
app('main')->getMyactivityTypeList($_ENV['user']['dic']);


��composer.json�����Զ��庯����ִ��
composer dump-auto


//�鿴ִ�е�sql
DB::enableQueryLog(); 
        $list = DB::table($this->dbname)
                ->paginate(18);
      
dd(DB::getQueryLog()); 



php artisan config:clear
composer dump-autoload