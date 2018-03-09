<?php
    public function getbase(&$request) {
        $base = (object) [];

        $base->rules = array(
            'title' => 'required|string|between:1,50'            
        );

        $base->attributes = array(
            'title' => '名称'            
        );
        $base->message = array();
        return $base;
    }

    function basemdb(&$request) {
        $mdb = (object) [];   


        /* rs */
        /**/
        $time = time();
        $date = date("Y-m-d H:i:s", $time);



        $rs['title'] = $request->title;     


        $date = date("Y-m-d H:i:s", time());

        $mdb->date = $date;
        $mdb->rs = $rs;

        return $mdb;
    }

     public function store(Request $request) {
        $base = $this->getbase($request);

                $rules = array(
            'upass' => 'required|string|confirmed'
        );

        $attributes = array(
            'upass' => '密码'
        );
        $message = array(
        );

        $rules = array_merge($base->rules, $rules);
        $attributes = array_merge($base->attributes, $attributes);
        $message = array_merge($base->message, $message);
        


        $validator = Validator::make(
                        $request->all(), $rules, $message, $attributes
        );

        if ($validator->fails()) {
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }

        $mdb = $this->basemdb($request);
        if( isset($mdb->err)) {
            $validator->errors()->add('error2', $mdb->err);
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );   
        }


        /**/
        $rs = $mdb->rs;
        $rs['ic'] = app('main')->getfirstic();    



        $rs['currentstatus'] = 'new';
        $rs['created_at'] = $mdb->date;

        if (DB::table($this->dbname)->insert($rs)) {
            $suctip[] = '请等待牵头部门审核通过';
            $suctip[] = '<a href = "' . $this->currentcontroller . '">点击这里返回课程管理</a>';
            return ( app('main')->jssuccess('保存成功', $suctip));
        } else {
            $validator->errors()->add('error', '保存失败');
            return ( app('main')->ajaxvali($validator->errors()->toArray()) );
        }
    }


     public function update(Request $request, $id) {
        $base = $this->getbase($request);

        $rules = array(
        );

        $attributes = array(
        );

        $message = array(
        );

        $rules = array_merge($base->rules, $rules);
        $attributes = array_merge($base->attributes, $attributes);
        $message = array_merge($base->message, $message);
        


        $validator = Validator::make(
                        $request->all(), $rules, $message, $attributes
        );
        $mdb = $this->basemdb($request);
        $rs = $mdb->rs;
        $rs['auditstatus'] = 'new';

        DB::table($this->dbname)
                ->where('id', $id)
                ->update($rs);

        $suctip[] = '请等待牵头部门审核';
        $suctip[] = '<a href = "' . $this->currentcontroller . '">返回课程管理</a>';
        return ( app('main')->jssuccess('操作成功', $suctip));
    }


            @if($oj->isedit)
            <input type="hidden" name="_method" value="put">
            @endif