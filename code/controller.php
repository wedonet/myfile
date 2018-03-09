    public function edit($id) {
        $data = DB::table($this->dbname)
                ->where('id', $id)
                ->first();

        $this->j['data'] = $data;

        return view($this->viewfolder . '.edit', ['j' => $this->j]);
    }