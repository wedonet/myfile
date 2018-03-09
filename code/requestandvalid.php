<?php

$rules = array(
            'title' => 'required|string|between:1,20|unique:' . $this->dbname . ',title',           
            'isxueyuan' => 'required|in:0,1',
        );

        $attributes = array(
            "title" => '名称',
            'ic' => '部门编号',
        );

        $message = array(
            'mytype.in' => '请选择部门类型',         
        );

        $validator = Validator::make(
                        $request->all(), $rules, $message, $attributes
        );

        if ($validator->fails()) {
           	return redirect()->back()->withInput()->withErrors(($validator->errors()->toArray()));
        }
