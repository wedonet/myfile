  $data = DB::table($this->dbname)
                ->where('id', $id)
                ->first();
   
        
        $department = app('main')->getdepartmentbyteacherbycode($data->sucode);

        if($department){
            $this->j['department'] = $department;
        }

        $this->j['data'] = $data;

        return view($this->viewfolder . '.detail', ['j' => $this->j]);