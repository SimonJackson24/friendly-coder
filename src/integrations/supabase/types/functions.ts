export interface DatabaseFunctions {
  get_next_version_number: {
    Args: {
      p_project_id: string
      p_file_id: string
    }
    Returns: number
  }
}